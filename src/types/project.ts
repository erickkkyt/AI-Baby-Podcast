export interface Project {
  id: string;
  created_at: string; // Or Date, depending on how you handle it
  user_id: string;
  topic: string;
  ethnicity: string;
  hair: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string | null;
  job_id: string; // The ID from n8n
  credits_deducted: number; // Add this if you store it, useful for display or logs
  error_message?: string | null; // To store any error messages from n8n
}

// You might also want a type for when creating a project,
// which might not have all fields yet (e.g., id, created_at are auto-generated)
export interface ProjectCreationData {
  user_id: string;
  topic: string;
  ethnicity: string;
  hair: string;
  job_id: string;
  credits_to_deduct: number;
}

// If you have user profile information linked to projects, you might define that here too
// For example, if projects list shows user's email or name from a join
// export interface UserProfile {
//   id: string;
//   email?: string;
//   // ... other profile fields
// } 