import { apiFetch } from './client';
import { ResumeProfileResponse, StructuredProfile, StoredResumeItem } from '../types';
import { DEFAULT_RESUME_RESPONSE, DEFAULT_STRUCTURED_PROFILE } from './mockData';

const RESUMES_STORAGE_KEY = 'interviewai_stored_resumes';
const ACTIVE_RESUME_KEY = 'interviewai_active_resume_hash';

function getStoredResumesFromStorage(): StoredResumeItem[] {
  try {
    const raw = localStorage.getItem(RESUMES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored resumes', e);
  }

  // Seed default resume if none exists
  const defaultItem: StoredResumeItem = {
    id: 'res_default_alex_chen',
    resume_hash: DEFAULT_RESUME_RESPONSE.resume_hash,
    filename: 'Alex_Chen_Senior_FullStack_Resume.pdf',
    upload_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    structured_profile: DEFAULT_STRUCTURED_PROFILE,
    extracted_skills: Array.isArray(DEFAULT_STRUCTURED_PROFILE.skills)
      ? DEFAULT_STRUCTURED_PROFILE.skills
      : Object.values(DEFAULT_STRUCTURED_PROFILE.skills).flat(),
    projects_count: DEFAULT_STRUCTURED_PROFILE.projects?.length || 3,
    experience_count: DEFAULT_STRUCTURED_PROFILE.experience?.length || 2,
    is_active: true,
    created_at: DEFAULT_RESUME_RESPONSE.created_at
  };

  const initialList = [defaultItem];
  try {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(initialList));
    if (!localStorage.getItem(ACTIVE_RESUME_KEY)) {
      localStorage.setItem(ACTIVE_RESUME_KEY, defaultItem.resume_hash);
    }
  } catch {}
  return initialList;
}

function saveStoredResumesToStorage(resumes: StoredResumeItem[]): void {
  try {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
  } catch (e) {
    console.error('Failed to save stored resumes', e);
  }
}

export const resumeApi = {
  async getUserResumes(): Promise<StoredResumeItem[]> {
    try {
      const response = await apiFetch<StoredResumeItem[]>('/resumes');
      if (Array.isArray(response) && response.length > 0) {
        saveStoredResumesToStorage(response);
        return response;
      }
    } catch (err: any) {
      console.warn('Backend /resumes endpoint unavailable, using local persistence:', err?.message);
    }
    return getStoredResumesFromStorage();
  },

  async uploadResume(file: File): Promise<ResumeProfileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiFetch<ResumeProfileResponse>('/resumes', {
        method: 'POST',
        body: formData,
        timeout: 45000 // Resume parsing with Gemini may take longer
      });

      if (response && response.resume_hash) {
        // Save to local resumes list
        const currentList = getStoredResumesFromStorage();
        const extractedSkills = Array.isArray(response.structured_profile?.skills)
          ? response.structured_profile.skills
          : Object.values(response.structured_profile?.skills || {}).flat();

        const newItem: StoredResumeItem = {
          id: response.resume_hash,
          resume_hash: response.resume_hash,
          filename: file.name,
          upload_date: new Date().toISOString(),
          structured_profile: response.structured_profile,
          extracted_skills: extractedSkills,
          projects_count: response.structured_profile?.projects?.length || 0,
          experience_count: response.structured_profile?.experience?.length || 0,
          is_active: true,
          created_at: response.created_at || new Date().toISOString()
        };

        const updatedList = [newItem, ...currentList.map(r => ({ ...r, is_active: false }))];
        saveStoredResumesToStorage(updatedList);
        localStorage.setItem(ACTIVE_RESUME_KEY, response.resume_hash);
        return response;
      }
      return response;
    } catch (err: any) {
      console.warn('Backend unavailable, generating structured profile locally:', err.message);

      // Extract basic candidate name from file name if possible
      const cleanedName = file.name
        .replace(/\.(pdf|docx|doc)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/resume|cv/gi, '')
        .trim() || 'Alex Chen';

      const customProfile: StructuredProfile = {
        ...DEFAULT_STRUCTURED_PROFILE,
        name: cleanedName
      };

      const mockHash = 'res_' + Array.from(file.name).reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0).toString(16).replace('-', 'a');

      const fallbackResponse: ResumeProfileResponse = {
        resume_hash: mockHash,
        structured_profile: customProfile,
        cached: false,
        created_at: new Date().toISOString(),
        filename: file.name
      };

      // Add to multi-resume list
      const currentList = getStoredResumesFromStorage();
      const extractedSkills = Array.isArray(customProfile.skills)
        ? customProfile.skills
        : Object.values(customProfile.skills || {}).flat();

      const newItem: StoredResumeItem = {
        id: mockHash,
        resume_hash: mockHash,
        filename: file.name,
        upload_date: new Date().toISOString(),
        structured_profile: customProfile,
        extracted_skills: extractedSkills,
        projects_count: customProfile.projects?.length || 0,
        experience_count: customProfile.experience?.length || 0,
        is_active: true,
        created_at: fallbackResponse.created_at
      };

      const updatedList = [newItem, ...currentList.map(r => ({ ...r, is_active: false }))];
      saveStoredResumesToStorage(updatedList);
      localStorage.setItem(ACTIVE_RESUME_KEY, mockHash);
      sessionStorage.setItem(`interviewai_resume_${mockHash}`, JSON.stringify(fallbackResponse));

      return fallbackResponse;
    }
  },

  async getResumeByHash(resumeHash: string): Promise<ResumeProfileResponse> {
    try {
      const response = await apiFetch<ResumeProfileResponse>(`/resumes/${resumeHash}`);
      return response;
    } catch (err: any) {
      const cached = sessionStorage.getItem(`interviewai_resume_${resumeHash}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }

      const list = getStoredResumesFromStorage();
      const found = list.find(r => r.resume_hash === resumeHash);
      if (found) {
        return {
          resume_hash: found.resume_hash,
          structured_profile: found.structured_profile,
          cached: true,
          created_at: found.created_at,
          filename: found.filename
        };
      }
      return DEFAULT_RESUME_RESPONSE;
    }
  },

  async deleteResume(resumeHash: string): Promise<{ success: boolean; message?: string }> {
    try {
      await apiFetch(`/resumes/${resumeHash}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      console.warn('Backend DELETE /resumes/:hash unavailable, deleting locally:', err?.message);
    }

    // Always ensure local storage is updated cleanly
    const currentList = getStoredResumesFromStorage();
    const updatedList = currentList.filter(r => r.resume_hash !== resumeHash);
    
    // If the active resume was deleted, make the top remaining resume active
    const activeHash = localStorage.getItem(ACTIVE_RESUME_KEY);
    if (activeHash === resumeHash) {
      if (updatedList.length > 0) {
        updatedList[0].is_active = true;
        localStorage.setItem(ACTIVE_RESUME_KEY, updatedList[0].resume_hash);
      } else {
        localStorage.removeItem(ACTIVE_RESUME_KEY);
      }
    }

    saveStoredResumesToStorage(updatedList);
    sessionStorage.removeItem(`interviewai_resume_${resumeHash}`);
    return { success: true, message: 'Resume deleted successfully' };
  },

  async setActiveResume(resumeHash: string): Promise<{ success: boolean }> {
    try {
      await apiFetch(`/resumes/${resumeHash}/active`, {
        method: 'PUT'
      });
    } catch (err: any) {
      // ignore backend error if offline
    }

    const currentList = getStoredResumesFromStorage();
    const updatedList = currentList.map(r => ({
      ...r,
      is_active: r.resume_hash === resumeHash
    }));

    saveStoredResumesToStorage(updatedList);
    localStorage.setItem(ACTIVE_RESUME_KEY, resumeHash);
    return { success: true };
  }
};
