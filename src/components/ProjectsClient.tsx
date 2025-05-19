'use client';

// import { useState, useEffect } from 'react';
// import { Film, PlusSquare } from 'lucide-react'; // Import if you want an icon for the title or a create button

// Interface for a project (example)
// interface Project {
//   id: string;
//   name: string;
//   thumbnailUrl?: string;
//   lastUpdated: string;
//   status: string;
// }

export default function ProjectsClient() {
  // const [projects, setProjects] = useState<Project[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Fetch projects here
  //   // setTimeout(() => { // Simulate fetching
  //   //   setProjects([
  //   //     { id: '1', name: 'My First Awesome Video', lastUpdated: '2 days ago', status: 'Completed', thumbnailUrl: 'https://via.placeholder.com/300x200/333/fff?text=Project%201'},
  //   //     { id: '2', name: 'Baby Podcast Commercial Ad', lastUpdated: '5 hours ago', status: 'Rendering', thumbnailUrl: 'https://via.placeholder.com/300x200/333/fff?text=Project%202'},
  //   //     { id: '3', name: 'Weekend Vlog Challenge', lastUpdated: 'Yesterday', status: 'Draft', thumbnailUrl: 'https://via.placeholder.com/300x200/333/fff?text=Project%203'},
  //   //   ]);
  //   //   setIsLoading(false);
  //   // }, 1000);
  // }, []);

  // if (isLoading) {
  //   return <div className="text-center py-10 text-gray-500">Loading projects...</div>;
  // }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">
          {/* <Film size={32} className="mr-3 inline-block text-purple-400"/> */}
          My Projects
        </h1>
        {/* Optional: Add a 'Create New Project' button here */}
        {/* <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"> */}
        {/*   <PlusSquare size={20} className="mr-2"/> Create New Project */}
        {/* </button> */}
      </div>

      {/* Placeholder for when there are no projects or while loading */}
      <div className="bg-[#1c2128] p-8 rounded-lg shadow-lg min-h-[300px] flex flex-col items-center justify-center">
        {/* Placeholder Icon (alternative to Film Reel or a simple Folder icon) */}
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p className="text-gray-500 text-center text-lg">
          You haven&apos;t created any projects yet.
        </p>
        <p className="text-gray-400 text-center mt-2"> {/* Slightly lighter text for better readability */}
          Click &quot;Create&quot; in the sidebar to start your first Baby Podcast!
        </p>
      </div>

      {/* Example of how projects might be listed in the future */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> */}
      {/*   {projects.map(project => ( */}
      {/*     <div key={project.id} className="bg-[#1c2128] p-4 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow cursor-pointer"> */}
      {/*       <div className="aspect-video bg-gray-700 rounded-md mb-3 overflow-hidden"> */}
      {/*         {project.thumbnailUrl ? ( */}
      {/*           <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover" /> */}
      {/*         ) : ( */}
      {/*           <div className="w-full h-full flex items-center justify-center text-gray-500">(No Preview)</div> */}
      {/*         )} */}
      {/*       </div> */}
      {/*       <h3 className="text-md font-semibold text-white truncate mb-1">{project.name}</h3> */}
      {/*       <p className="text-xs text-gray-400"><span className="font-medium">Status:</span> {project.status}</p> */}
      {/*       <p className="text-xs text-gray-500">Last updated: {project.lastUpdated}</p> */}
      {/*     </div> */}
      {/*   ))} */}
      {/* </div> */}
    </section>
  );
}