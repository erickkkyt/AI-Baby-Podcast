'use client';

import type { Project } from '@/types/project';
import { Video, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // For English date formatting

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-700 rounded-lg min-h-[250px] mt-6">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-3" />
        <h2 className="text-lg font-semibold mb-1 text-gray-200">No Projects Yet</h2>
        <p className="text-sm text-gray-500">
          You haven&apos;t created any podcast projects yet. <br />
          Go to the Dashboard to start your first AI-generated podcast!
        </p>
      </div>
    );
  }

  const getStatusClasses = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/90 text-green-50';
      case 'processing':
        return 'bg-blue-500/90 text-blue-50';
      case 'failed':
        return 'bg-red-500/90 text-red-50';
      default:
        return 'bg-gray-500/90 text-gray-50';
    }
  };

  return (
    <>
      {/* Global warning for video link expiration */}
      <div className="mb-5 p-3 bg-yellow-900/40 border border-yellow-700/60 rounded-md">
        <p className="text-xs text-yellow-300 flex items-center justify-center">
          <AlertTriangle className="inline h-4 w-4 mr-2 flex-shrink-0" /> 
          <span className="leading-tight">Video links may expire in 10 minutes. Please download your completed videos soon.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Responsive grid */}
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-slate-800/70 border border-slate-700 rounded-lg text-slate-100 flex flex-col shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-700">
              <h3 className="truncate text-sm font-medium text-slate-100">Topic: {project.topic || 'N/A'}</h3>
              <p className="text-[0.7rem] text-slate-400 pt-0.5">
                Created: {format(new Date(project.created_at), 'MMM d, yyyy p', { locale: enUS })}
              </p>
            </div>

            {/* Content */}
            <div className="p-3 flex-grow text-xs">
              <div className="mb-2.5">
                <span
                  className={`capitalize px-2 py-0.5 text-[0.65rem] font-semibold rounded-full inline-flex items-center leading-normal ${getStatusClasses(project.status)}`}
                >
                  {project.status === 'processing' && <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />}
                  {project.status}
                </span>
              </div>
              
              {project.status === 'completed' && project.video_url ? (
                <div className="aspect-video bg-black rounded-md overflow-hidden mb-2.5 shadow-inner">
                  <video controls src={project.video_url} className="w-full h-full object-contain">
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : project.status === 'processing' ? (
                <div className="aspect-video bg-slate-700/50 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                  <Loader2 className="h-6 w-6 text-slate-400 animate-spin mb-1.5" /> 
                  <p className="text-[0.7rem] text-slate-300">Video Processing...</p>
                  <p className="text-[0.65rem] text-slate-500">Please wait</p>
                </div>
              ) : project.status === 'failed' ? (
                <div className="aspect-video bg-red-700/20 border border-red-600/40 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                  <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                  <p className="text-[0.7rem] font-medium text-red-300">Video Failed</p>
                  <p className="text-[0.65rem] text-red-400 mt-0.5">Sorry, an error occurred.</p>
                </div>
              ) : ( 
                <div className="aspect-video bg-slate-700/50 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                   <Video className="w-6 h-6 text-slate-500 mb-1.5" />
                   <p className="text-[0.7rem] text-slate-400">Video Not Available</p>
                </div>
              )}
              
              <div className="space-y-0.5 text-[0.7rem]"> {/* Smaller text for details */}
                  <p className="text-slate-400">Ethnicity: <span className="font-normal text-slate-300">{project.ethnicity || 'N/A'}</span></p>
                  <p className="text-slate-400">Hair: <span className="font-normal text-slate-300">{project.hair || 'N/A'}</span></p>
              </div>
            </div>
            
            {/* Footer (Download Button) */}
            <div className="p-2.5 border-t border-slate-700 mt-auto">
              {project.status === 'completed' && project.video_url ? (
                <div className="w-full">
                  <a 
                    href={project.video_url} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-[0.7rem] inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150"
                  >
                    <Download className="mr-1 h-3 w-3" /> Download Video
                  </a>
                </div>
              ) : (
                <button 
                  disabled 
                  className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-slate-600 text-slate-400 cursor-not-allowed"
                >
                  <Download className="mr-1 h-3 w-3" /> Download Unavailable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}