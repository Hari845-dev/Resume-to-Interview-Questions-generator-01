import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Code,
  Tag,
  Target,
  Trash2,
  Check,
  Eye,
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resumeApi } from '../api';
import { StoredResumeItem, StructuredProfile } from '../types';

export const ResumeView: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumes,
    activeResumeHash,
    activeResumeProfile,
    switchActiveResume,
    deleteResume,
    refreshResumes
  } = useAuth();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [resumeToDelete, setResumeToDelete] = useState<StoredResumeItem | null>(null);
  const [viewingProfileResume, setViewingProfileResume] = useState<StoredResumeItem | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      await resumeApi.uploadResume(file);
      await refreshResumes();
      setShowUploadModal(false);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      await deleteResume(resumeToDelete.resume_hash);
      setResumeToDelete(null);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  // Find active resume item
  const activeResumeItem = resumes.find(r => r.resume_hash === activeResumeHash) || resumes[0];
  const otherResumes = resumes.filter(r => r.resume_hash !== activeResumeItem?.resume_hash);

  // Active structured profile to display
  const displayProfile: StructuredProfile | undefined =
    viewingProfileResume?.structured_profile || activeResumeProfile?.structured_profile || activeResumeItem?.structured_profile;

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              RESUME & PROFILE MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
              {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Stored
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-gray-900 mt-1">
            My Resumes
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            Manage your uploaded resumes, switch active preparation profiles, and inspect evidence-grounded skill claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload New Resume</span>
          </button>

          <button
            onClick={() => navigate('/app/prepare')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Start Preparation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 1: RESUME HISTORY & MANAGEMENT */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
          Active & Stored Resumes
        </h2>

        {resumes.length === 0 ? (
          <div className="p-12 rounded-[32px] bg-white border-2 border-dashed border-gray-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-gray-900">No Resumes Uploaded Yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                Upload your resume to extract verifiable skills, projects, and career evidence for grounded interview preparation.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg shadow-indigo-100 transition-all"
            >
              Upload Resume Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Resume Card */}
            {activeResumeItem && (
              <div className="p-6 sm:p-7 rounded-[28px] bg-white border-2 border-indigo-600 shadow-md shadow-indigo-50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {activeResumeItem.filename || 'Candidate Resume'}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 font-semibold">
                          <Check className="w-3 h-3 text-green-600" /> Active for Preparation
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        Uploaded on {formatDate(activeResumeItem.upload_date)} • {activeResumeItem.projects_count} projects • {activeResumeItem.experience_count} roles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewingProfileResume(activeResumeItem)}
                      className="px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => setResumeToDelete(activeResumeItem)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Extracted Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeResumeItem.extracted_skills?.slice(0, 10).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-full bg-indigo-50/70 border border-indigo-100 text-[11px] font-medium text-indigo-900"
                    >
                      {skill}
                    </span>
                  ))}
                  {(activeResumeItem.extracted_skills?.length || 0) > 10 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-mono text-gray-500">
                      +{(activeResumeItem.extracted_skills?.length || 0) - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Previous Resumes List */}
            {otherResumes.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                  Previous Resumes ({otherResumes.length})
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {otherResumes.map(r => (
                    <div
                      key={r.resume_hash}
                      className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {r.filename}
                          </h4>
                          <p className="text-xs text-gray-500 font-mono">
                            Uploaded {formatDate(r.upload_date)} • {r.projects_count} projects • {r.experience_count} roles
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => switchActiveResume(r.resume_hash)}
                          className="px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>Use for Preparation</span>
                        </button>

                        <button
                          onClick={() => setViewingProfileResume(r)}
                          className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setResumeToDelete(r)}
                          className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: EXTRACTED STRUCTURED PROFILE OF ACTIVE/SELECTED RESUME */}
      {displayProfile && (
        <div className="space-y-8 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  PARSED CANDIDATE EVIDENCE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-green-50 text-green-700 border border-green-200">
                  Grounding Data
                </span>
              </div>
              <h2 className="text-2xl font-serif italic text-gray-900 mt-1">
                {displayProfile.name || 'Candidate Profile'}
              </h2>
            </div>
            {viewingProfileResume && (
              <button
                onClick={() => setViewingProfileResume(null)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Back to Active Resume Profile
              </button>
            )}
          </div>

          {/* SKILLS BREAKDOWN */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Tag className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                Extracted Skills & Competencies
              </h3>
            </div>

            {Array.isArray(displayProfile.skills) ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {displayProfile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-100 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {Object.entries(displayProfile.skills || {}).map(([category, items]) => {
                  if (!items || (items as string[]).length === 0) return null;
                  return (
                    <div key={category} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase w-28 shrink-0">
                        {category}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(items as string[]).map((sk: string) => (
                          <span
                            key={sk}
                            className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-100 text-xs font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROJECTS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                Featured Projects ({displayProfile.projects?.length || 0})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProfile.projects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-gray-900 leading-snug">
                        {proj.title}
                      </h4>
                      {proj.role && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-600 shrink-0">
                          {proj.role}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tech_stack?.map(tech => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-700 text-[11px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Highlights */}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-2 text-xs text-gray-600 list-disc list-inside">
                        {proj.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="line-clamp-2">
                            {hl}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {proj.evidence_snippet && (
                    <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-mono italic bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100/60">
                      <span className="font-bold text-indigo-600 not-italic block text-[9px] uppercase tracking-wider mb-1">
                        Grounded Evidence:
                      </span>
                      "{proj.evidence_snippet}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE TIMELINE */}
          {displayProfile.experience && displayProfile.experience.length > 0 && (
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                  Professional Experience
                </h3>
              </div>

              <div className="space-y-6">
                {displayProfile.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 space-y-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-gray-900">
                        {exp.role} • <span className="text-indigo-600 font-medium">{exp.company}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exp.duration}</span>
                        {exp.location && <span>({exp.location})</span>}
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                      {exp.highlights?.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION & CERTIFICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProfile.education && displayProfile.education.length > 0 && (
              <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Education
                  </h3>
                </div>

                <div className="space-y-3">
                  {displayProfile.education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 text-sm">{edu.degree}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{edu.institution}</div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mt-2 pt-2 border-t border-gray-200/60">
                        <span>{edu.year}</span>
                        {edu.score && <span className="font-semibold text-gray-700">{edu.score}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {displayProfile.certifications && displayProfile.certifications.length > 0 && (
              <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Award className="w-4 h-4 text-orange-500" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Certifications
                  </h3>
                </div>

                <div className="space-y-3">
                  {displayProfile.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
                      <div className="font-bold text-gray-900 text-sm">{cert.name}</div>
                      <div className="text-xs text-orange-800/80 mt-0.5">{cert.issuer}</div>
                      {cert.year && (
                        <div className="text-[11px] text-orange-600 font-mono mt-1">
                          Issued {cert.year}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPLOAD RESUME MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif italic text-gray-900">
                Upload New Resume
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/40'
                  : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {isUploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono font-semibold text-indigo-700">
                    Extracting candidate profile and grounding evidence...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto" />
                  <div className="text-sm font-bold text-gray-900">
                    Choose PDF or DOCX file
                  </div>
                  <div className="text-xs text-gray-500">
                    Drag and drop or click to browse files
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-100 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {resumeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-serif italic text-gray-900">
                Delete this resume?
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-900">{resumeToDelete.filename}</strong>? Deleting this resume will remove its stored profile and citation evidence.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResumeToDelete(null)}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-100 transition-all"
              >
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
