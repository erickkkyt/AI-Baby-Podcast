'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings2, Sparkles, Film, SearchCode, ChevronDown, X } from 'lucide-react'; // Film might be unused now
import { ConfirmationModal } from './modals/ConfirmationModal';
import InsufficientCreditsModal from './modals/InsufficientCreditsModal';
import { useRouter } from 'next/navigation'; // Import useRouter
import AudioTrimUpload from './audio/audio-trim-upload';

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  isImportant: boolean;
}

interface YouTubeVideo {
  id:string;
  videoId: string;
  title: string;
}

// Define a type for the profile to expect `credits`
// interface UserProfile {  // This seems to be commented out or unused, check if needed
//   credits: number;
// }

const MAX_TOPIC_LENGTH = 100;
const MAX_CUSTOM_FIELD_LENGTH = 50;
const MAX_TEXT_SCRIPT_LENGTH = 500; // Changed from 5000 to 500
const REQUIRED_CREDITS_PER_PROJECT = 0; 
const MAX_FILE_SIZE_MB = 3; // Changed from 5 to 3

export default function DashboardClient({ currentCredits }: { currentCredits: number }) {
  const router = useRouter(); // Initialize useRouter
  const [allReceivedNotifications, setAllReceivedNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true); // This might need to be re-evaluated if My Projects is gone

  // --- States for Module 1: Baby's Appearance --- 
  const [appearanceCreationMode, setAppearanceCreationMode] = useState<'features' | 'custom_image' | 'portrait_to_baby'>('features');
  
  // Option 1.1: Generate with Features
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [customEthnicity, setCustomEthnicity] = useState('');
  const [isEthnicityOther, setIsEthnicityOther] = useState(false);
  const [customEthnicityError, setCustomEthnicityError] = useState('');

  const [selectedHair, setSelectedHair] = useState('');
  const [customHair, setCustomHair] = useState('');
  const [isHairOther, setIsHairOther] = useState(false);
  const [customHairError, setCustomHairError] = useState('');

  // Option 1.2: Upload Custom Baby Image
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [customImageError, setCustomImageError] = useState<string>('');

  // Option 1.3: Portrait to Baby
  const [originalPortraitFile, setOriginalPortraitFile] = useState<File | null>(null);
  const [originalPortraitPreview, setOriginalPortraitPreview] = useState<string | null>(null);
  const [originalPortraitError, setOriginalPortraitError] = useState<string>('');

  // --- States for Module 2: Podcast Content ---
  const [contentCreationMode, setContentCreationMode] = useState<'generate_from_topic' | 'audio_script' | 'direct_text_input'>('generate_from_topic');
  
  // Option 2.1: Generate from Topic
  const [topicOfBabyPodcast, setTopicOfBabyPodcast] = useState('');
  const [topicError, setTopicError] = useState('');

  // Option 2.2: Upload Audio Script
  const [audioScriptFile, setAudioScriptFile] = useState<File | null>(null);
  const [audioScriptError, setAudioScriptError] = useState<string>('');

  // Option 2.3: Direct Text Input
  const [textScriptDirectInput, setTextScriptDirectInput] = useState('');
  const [textScriptDirectInputError, setTextScriptDirectInputError] = useState('');

  // 动态最大字符数 = 当前积分 * 15
  const maxTextScriptLength = currentCredits * 15;

  // --- States for Video Output Settings ---
  const [videoResolution, setVideoResolution] = useState<'540p' | '720p'>('540p');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('9:16');

  // --- General Form States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' | null }>({ message: '', type: null });

  // Constants for file uploads
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a']; // Example audio types

  const [audioScriptFileBlob, setAudioScriptFileBlob] = useState<Blob | null>(null);
  const [audioScriptFileName, setAudioScriptFileName] = useState<string>('');

  const handleRemoveCustomImage = () => {
    setCustomImageFile(null);
    setCustomImagePreview(null);
    setCustomImageError('');
    const fileInput = document.getElementById('custom-baby-image-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveOriginalPortrait = () => {
    setOriginalPortraitFile(null);
    setOriginalPortraitPreview(null);
    setOriginalPortraitError('');
    const fileInput = document.getElementById('original-portrait-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const ethnicityOptions = [
    { value: 'asian', label: 'Asian' },
    { value: 'middle_eastern', label: 'Middle Eastern' },
    { value: 'black_african_american', label: 'Black or African American' },
    { value: 'white_caucasian', label: 'White or Caucasian' },
    { value: '_other_', label: 'Others' },
  ];

  const hairOptions = [
    { value: 'bald', label: 'Bald' },
    { value: 'curly', label: 'Curly' },
    { value: 'ponytail', label: 'Ponytail' },
    { value: 'crew_cut', label: 'Crew Cut' },
    { value: 'bob', label: 'Bob' },
    { value: 'bun', label: 'Bun' },
    { value: 'straight', label: 'Straight' },
    { value: '_other_', label: 'Others' },
  ];

  const handleEthnicityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEthnicity(value);
    setSubmissionStatus({ message: '', type: null });
    if (value === '_other_') {
      setIsEthnicityOther(true);
      setCustomEthnicityError(''); 
    } else {
      setIsEthnicityOther(false);
      setCustomEthnicity(''); 
      setCustomEthnicityError(''); 
    }
  };

  const handleHairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedHair(value);
    setSubmissionStatus({ message: '', type: null });
    if (value === '_other_') {
      setIsHairOther(true);
      setCustomHairError(''); 
    } else {
      setIsHairOther(false);
      setCustomHair('');
      setCustomHairError(''); 
    }
  };
  
  const handleCustomEthnicityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomEthnicity(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_CUSTOM_FIELD_LENGTH) {
      setCustomEthnicityError(`Exceeded ${MAX_CUSTOM_FIELD_LENGTH} characters. Please shorten.`);
    } else {
      setCustomEthnicityError('');
    }
  };

  const handleCustomHairChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomHair(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_CUSTOM_FIELD_LENGTH) {
      setCustomHairError(`Exceeded ${MAX_CUSTOM_FIELD_LENGTH} characters. Please shorten.`);
    } else {
      setCustomHairError('');
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTopicOfBabyPodcast(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_TOPIC_LENGTH) {
      setTopicError(`Exceeded ${MAX_TOPIC_LENGTH} characters. Please shorten.`);
    } else {
      setTopicError('');
    }
  };

  const handleTextScriptDirectInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextScriptDirectInput(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > maxTextScriptLength) {
      setTextScriptDirectInputError(`Exceeded ${maxTextScriptLength} characters. Please shorten.`);
    } else {
      setTextScriptDirectInputError('');
    }
  };

  const handleCustomEthnicityBlur = () => {
    if (!customEthnicity.trim() && isEthnicityOther) {
        setIsEthnicityOther(false); 
        setSelectedEthnicity(''); 
        setCustomEthnicityError('');
    }
  };

  const handleCustomHairBlur = () => {
    if (!customHair.trim() && isHairOther) {
        setIsHairOther(false);
        setSelectedHair('');
        setCustomHairError('');
    }
  };

  // Handler for creation mode change - RENAME to handleAppearanceModeChange
  const handleAppearanceModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as 'features' | 'custom_image' | 'portrait_to_baby';
    setAppearanceCreationMode(newMode);
    setSubmissionStatus({ message: '', type: null }); 

    // Reset fields from other appearance modes
    if (newMode !== 'features') {
      setSelectedEthnicity(''); 
      setCustomEthnicity('');
      setIsEthnicityOther(false);
      setCustomEthnicityError('');
      setSelectedHair('');
      setCustomHair('');
      setIsHairOther(false);
      setCustomHairError('');
    }
    if (newMode !== 'custom_image') {
      setCustomImageFile(null);
      setCustomImagePreview(null);
      setCustomImageError('');
    }
    if (newMode !== 'portrait_to_baby') {
      setOriginalPortraitFile(null);
      setOriginalPortraitPreview(null);
      setOriginalPortraitError('');
    }
  };

  const handleContentModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as 'generate_from_topic' | 'audio_script' | 'direct_text_input';
    setContentCreationMode(newMode);
    setSubmissionStatus({ message: '', type: null });

    // Reset fields from other content modes
    if (newMode !== 'generate_from_topic') {
      // Topic is now exclusively for 'generate_from_topic'
      // setTopicOfBabyPodcast(''); // Keep if it serves as a general title regardless of content mode
      // setTopicError('');
    }
    if (newMode !== 'audio_script') {
      setAudioScriptFile(null);
      setAudioScriptError('');
    }
    if (newMode !== 'direct_text_input') {
      setTextScriptDirectInput('');
      setTextScriptDirectInputError('');
    }
  };

  // Handler for custom image file change
  const handleCustomImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setCustomImageError(`Invalid file type. Please upload a JPEG, PNG, or WebP image.`);
        setCustomImageFile(null);
        setCustomImagePreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setCustomImageError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setCustomImageFile(null);
        setCustomImagePreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      setCustomImageFile(file);
      setCustomImageError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCustomImageFile(null);
      setCustomImagePreview(null);
      setCustomImageError('');
    }
  };

  const handleOriginalPortraitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setOriginalPortraitError(`Invalid file type. Please upload a JPEG, PNG, or WebP image.`);
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setOriginalPortraitError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      setOriginalPortraitFile(file);
      setOriginalPortraitError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPortraitPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalPortraitFile(null);
      setOriginalPortraitPreview(null);
      setOriginalPortraitError('');
    }
  };

  const handleAudioTrimReady = (blob: Blob, filename: string) => {
    setAudioScriptFileBlob(blob);
    setAudioScriptFileName(filename);
    setAudioScriptError('');
  };

  const handleAudioScriptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setAudioScriptError(`Invalid file type. Allowed: ${ALLOWED_AUDIO_TYPES.join(', ')}.`);
        setAudioScriptFile(null);
        event.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setAudioScriptError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setAudioScriptFile(null);
        event.target.value = '';
        return;
      }

      // 检查音频时长，最大为当前积分数
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl); // 及时释放
        const maxDuration = currentCredits;
        if (audio.duration > maxDuration) {
          const durationCeil = Math.ceil(audio.duration);
          setAudioScriptError(`Current audio duration: ${durationCeil}s. Audio duration cannot exceed ${maxDuration}s.`);
          setAudioScriptFile(null);
          if (event.target) {
            event.target.value = '';
          }
        } else {
          setAudioScriptFile(file);
          setAudioScriptError('');
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setAudioScriptError('Failed to load audio metadata. Please try a different file.');
        setAudioScriptFile(null);
        if (event.target) {
            event.target.value = '';
        }
      };

      audio.src = objectUrl;

    } else {
      setAudioScriptFile(null);
      setAudioScriptError('');
    }
  };

  const handleVideoResolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoResolution(event.target.value as '540p' | '720p');
    setSubmissionStatus({ message: '', type: null });
  };

  const handleAspectRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAspectRatio(event.target.value as '1:1' | '16:9' | '9:16');
    setSubmissionStatus({ message: '', type: null });
  };

  const handleRemoveAudioScript = () => {
    setAudioScriptFile(null);
    setAudioScriptError('');
    const fileInput = document.getElementById('audio-script-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  };

  const executeSubmitLogic = async () => {
    setIsSubmitting(true);
    setSubmissionStatus({ message: '✨ Processing your request...', type: 'info' }); 

    const formData = new FormData();

    // Append mode selections
    formData.append('appearanceCreationMode', appearanceCreationMode);
    formData.append('contentCreationMode', contentCreationMode);

    // Append video settings
    formData.append('videoResolution', videoResolution);
    formData.append('aspectRatio', aspectRatio);

    // Append data based on Appearance Mode
    if (appearanceCreationMode === 'features') {
      formData.append('ethnicity', isEthnicityOther ? customEthnicity : selectedEthnicity);
      formData.append('hair', isHairOther ? customHair : selectedHair);
    } else if (appearanceCreationMode === 'custom_image' && customImageFile) {
      formData.append('customBabyImageFile', customImageFile);
    } else if (appearanceCreationMode === 'portrait_to_baby' && originalPortraitFile) {
      formData.append('originalPortraitFile', originalPortraitFile);
    }

    // Append data based on Content Mode
    if (contentCreationMode === 'generate_from_topic') {
      formData.append('topic', topicOfBabyPodcast);
    } else if (contentCreationMode === 'audio_script' && audioScriptFileBlob) {
      const file = new File([audioScriptFileBlob], audioScriptFileName || 'audio_clip.mp3', { type: 'audio/mpeg' });
      formData.append('audioScriptFile', file);
    } else if (contentCreationMode === 'direct_text_input') {
      formData.append('textScriptDirectInput', textScriptDirectInput);
    }
    
    // As per the latest request, topic is only primary for 'generate_from_topic'.
    // If it exists and is NOT 'generate_from_topic' mode, it might be sent as general metadata.
    // For RPC designed according to 5.28.md v2, p_topic is only used when p_content_creation_mode = 'generate_from_topic'.
    // So, we only *need* to send it then. However, sending it always if filled won't break that specific RPC.
    // Let's keep it simple: if topicOfBabyPodcast has a value, and the primary content source is not topic,
    // it is currently not being explicitly appended to FormData.
    // The `topic` field will only be populated in FormData if contentCreationMode === 'generate_from_topic'.

    try {
      const response = await fetch('/api/submit-podcast-idea', { 
        method: 'POST',
        body: formData, 
      });
      const result = await response.json();
      
      if (response.ok) {
        setSubmissionStatus({ 
          message: `✅ Your AI baby podcast request has been submitted and is being processed. You can check "My Projects" later for updates. This usually takes about 3 minutes.`, 
          type: 'success' 
        });
        router.refresh(); 
        // Reset form fields
        setAppearanceCreationMode('features');
        setSelectedEthnicity('');
        setCustomEthnicity('');
        setIsEthnicityOther(false);
        setCustomEthnicityError('');
        setSelectedHair('');
        setCustomHair('');
        setIsHairOther(false);
        setCustomHairError('');
        setCustomImageFile(null);
        setCustomImagePreview(null);
        setCustomImageError('');
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        setOriginalPortraitError('');
        
        setContentCreationMode('generate_from_topic');
        setTopicOfBabyPodcast('');
        setTopicError('');
        setAudioScriptFile(null);
        setAudioScriptError('');
        setTextScriptDirectInput('');
        setTextScriptDirectInputError('');

        setVideoResolution('540p');
        setAspectRatio('9:16');
        
      } else {
        setSubmissionStatus({ 
          message: `⚠️ ${result.message || 'Unknown server error'}. ${result.details || ''}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Failed to submit to API route:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmissionStatus({ message: `❌ An unexpected error occurred while submitting: ${errorMessage}. Please try again.`, type: 'error' });
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleAICreatePress = () => {
    setSubmissionStatus({ message: '', type: null }); 
    if (currentCredits <= REQUIRED_CREDITS_PER_PROJECT) {
      setIsCreditsModalOpen(true);
      return; 
    }
    setShowConfirmModal(true);
  };

  const youtubeVideos: YouTubeVideo[] = [
    { id: '1', videoId: 'EuWy150zyp8', title: '' },
    { id: '2', videoId: 'Oj_2aW7p0qc', title: '' },
    { id: '3', videoId: 'XKEbMspIrfo', title: '' },
  ];

  useEffect(() => {
    // This isLoading was likely for the "My Projects" section. 
    // You might want to remove or adjust this if it's no longer relevant.
    // For now, I'll keep its basic structure.
    setIsLoading(true); 
    const timer = setTimeout(() => {
      setAllReceivedNotifications([]); // Example: clear notifications on load, or fetch them
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selectBaseClasses = "w-full p-2.5 pr-8 bg-[#0d1117] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white text-sm";
  const inputBaseClasses = "w-full p-2.5 bg-[#0d1117] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 text-white text-sm";
  const sectionTitleClasses = "text-xl font-semibold text-purple-400 mb-4 border-b border-gray-700 pb-2";
  const errorTextClasses = "text-red-500 text-xs mt-1";
  const charCountClasses = "text-xs text-gray-400 mt-1 text-right";

  const isSubmitButtonDisabled = 
    isSubmitting ||
    // Validation for Appearance Mode 'features'
    (appearanceCreationMode === 'features' && (
      !!customEthnicityError || 
      !!customHairError || 
      (isEthnicityOther && !customEthnicity.trim()) || 
      (isHairOther && !customHair.trim()) || 
      (!isEthnicityOther && !selectedEthnicity) || 
      (!isHairOther && !selectedHair)
    )) ||
    // Validation for Appearance Mode 'custom_image'
    (appearanceCreationMode === 'custom_image' && (!customImageFile || !!customImageError)) ||
    // Validation for Appearance Mode 'portrait_to_baby'
    (appearanceCreationMode === 'portrait_to_baby' && (!originalPortraitFile || !!originalPortraitError)) ||
    
    // Validation for Content Mode 'generate_from_topic'
    (contentCreationMode === 'generate_from_topic' && (!topicOfBabyPodcast.trim() || !!topicError)) ||
    // Validation for Content Mode 'audio_script'
    (contentCreationMode === 'audio_script' && (!audioScriptFileBlob || !!audioScriptError)) ||
    // Validation for Content Mode 'direct_text_input'
    (contentCreationMode === 'direct_text_input' && (!textScriptDirectInput.trim() || !!textScriptDirectInputError));

  return (
    <div className="space-y-8">
      <section className="bg-[#161b22] p-6 rounded-lg shadow-md space-y-6">
        
        {/* --- MODULE 1: Baby's Appearance --- */}
        <div>
          <h3 className={sectionTitleClasses}>Baby&apos;s Appearance</h3>
          <p className="text-sm text-gray-400 mb-3">Choose how to generate the baby&apos;s appearance.</p>
          
          <div className="mb-6 mt-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <label htmlFor="appearanceFeatures" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="appearanceFeatures"
                  name="appearanceCreationModeOption"
                  value="features"
                  checked={appearanceCreationMode === 'features'}
                  onChange={handleAppearanceModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Generate with Features</span>
              </label>
              <label htmlFor="appearanceCustomImage" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="appearanceCustomImage"
                  name="appearanceCreationModeOption"
                  value="custom_image"
                  checked={appearanceCreationMode === 'custom_image'}
                  onChange={handleAppearanceModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Upload Custom Baby Image</span>
              </label>
              <label htmlFor="appearancePortraitToBaby" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="appearancePortraitToBaby"
                  name="appearanceCreationModeOption"
                  value="portrait_to_baby"
                  checked={appearanceCreationMode === 'portrait_to_baby'}
                  onChange={handleAppearanceModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Convert Portrait to Baby Image (needs extra 1-2 minutes processing time)</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering based on appearanceCreationMode */} 
          {appearanceCreationMode === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-6">
              <p className="md:col-span-2 text-sm text-gray-400 mb-3">Select the baby&apos;s ethnicity and hair features for AI generation.</p>
              <div>
                <label htmlFor="babyEthnicity" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Baby&apos;s Ethnicity
                </label>
                <div className="relative">
                  {isEthnicityOther ? (
                    <>
                      <input
                        id="customBabyEthnicity"
                        type="text"
                        value={customEthnicity}
                        onChange={handleCustomEthnicityChange}
                        onBlur={handleCustomEthnicityBlur}
                        placeholder="Enter custom ethnicity"
                        className={`${inputBaseClasses} ${customEthnicityError ? 'border-red-500' : 'border-gray-700'}`}
                        maxLength={MAX_CUSTOM_FIELD_LENGTH + 1} 
                      />
                      {customEthnicityError && <p className={errorTextClasses}>{customEthnicityError}</p>}
                      <p className={charCountClasses}>{customEthnicity.length}/{MAX_CUSTOM_FIELD_LENGTH}</p>
                    </>
                  ) : (
                    <select
                      id="babyEthnicity"
                      value={selectedEthnicity}
                      onChange={handleEthnicityChange}
                      className={selectBaseClasses}
                    >
                      <option value="" disabled>Select ethnicity...</option>
                      {ethnicityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="babyHair" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Baby&apos;s Hair
                </label>
                <div className="relative">
                  {isHairOther ? (
                     <>
                      <input
                        id="customBabyHair"
                        type="text"
                        value={customHair}
                        onChange={handleCustomHairChange}
                        onBlur={handleCustomHairBlur}
                        placeholder="Enter custom hair type"
                        className={`${inputBaseClasses} ${customHairError ? 'border-red-500' : 'border-gray-700'}`}
                        maxLength={MAX_CUSTOM_FIELD_LENGTH + 1} 
                      />
                      {customHairError && <p className={errorTextClasses}>{customHairError}</p>}
                      <p className={charCountClasses}>{customHair.length}/{MAX_CUSTOM_FIELD_LENGTH}</p>
                    </>
                  ) : (
                    <select
                      id="babyHair"
                      value={selectedHair}
                      onChange={handleHairChange}
                      className={selectBaseClasses}
                    >
                      <option value="" disabled>Select hair type...</option>
                      {hairOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

          {appearanceCreationMode === 'custom_image' && (
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="custom-baby-image-input" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Baby Image <span className="text-xs text-gray-400">(Upload your baby image. This image will be used directly.)</span>
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="custom-baby-image-input"
                    className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 ease-in-out mr-3"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="custom-baby-image-input"
                    name="customBabyImageFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCustomImageChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-400">
                    {customImageFile ? customImageFile.name : 'No file chosen'}
                  </span>
                </div>
                {customImageError && <p className={errorTextClasses}>{customImageError}</p>}
              </div>

              {customImagePreview && (
                <div className="mt-4"> 
                  <p className="block text-sm font-medium text-gray-300 mb-1.5">Image Preview:</p>
                  <div className="flex items-end space-x-2">
                    <div className="inline-block">
                      <Image
                        src={customImagePreview}
                        alt="Custom baby preview"
                        width={192} 
                        height={192}
                        className="rounded-md border border-gray-700 object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCustomImage}
                      className="text-sm text-red-500 hover:text-red-400 px-3 py-1 border border-red-500 hover:border-red-400 rounded-md transition-colors"
                      aria-label="Remove uploaded image"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {appearanceCreationMode === 'portrait_to_baby' && (
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="original-portrait-input" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Your Portrait Photo <span className="text-xs text-gray-400">(Upload a portrait photo, and the AI will transform it into a baby image.)</span>
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="original-portrait-input"
                    className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 ease-in-out mr-3"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="original-portrait-input"
                    name="originalPortraitFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleOriginalPortraitChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-400">
                    {originalPortraitFile ? originalPortraitFile.name : 'No file chosen'}
                  </span>
                </div>
                {originalPortraitError && <p className={errorTextClasses}>{originalPortraitError}</p>}
              </div>

              {originalPortraitPreview && (
                <div className="mt-4"> 
                  <p className="block text-sm font-medium text-gray-300 mb-1.5">Image Preview:</p>
                  <div className="flex items-end space-x-2">
                    <div className="inline-block">
                      <Image
                        src={originalPortraitPreview}
                        alt="Original portrait preview"
                        width={192} 
                        height={192}
                        className="rounded-md border border-gray-700 object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveOriginalPortrait}
                      className="text-sm text-red-500 hover:text-red-400 px-3 py-1 border border-red-500 hover:border-red-400 rounded-md transition-colors"
                      aria-label="Remove uploaded image"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- MODULE 2: Podcast Content --- */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className={sectionTitleClasses}>Podcast Content</h3>
          <p className="text-sm text-gray-400 mb-3">Choose how to generate the podcast content.</p>

          <div className="mb-6 mt-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <label htmlFor="contentGenerateTopic" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="contentGenerateTopic"
                  name="contentCreationModeOption"
                  value="generate_from_topic"
                  checked={contentCreationMode === 'generate_from_topic'}
                  onChange={handleContentModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Generate with Topic</span>
              </label>
              <label htmlFor="contentDirectTextInput" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="contentDirectTextInput"
                  name="contentCreationModeOption"
                  value="direct_text_input"
                  checked={contentCreationMode === 'direct_text_input'}
                  onChange={handleContentModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Direct Podcast Content Input</span>
              </label>
              <label htmlFor="contentAudioScript" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="contentAudioScript"
                  name="contentCreationModeOption"
                  value="audio_script"
                  checked={contentCreationMode === 'audio_script'}
                  onChange={handleContentModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Upload Custom Audio Script</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering based on contentCreationMode */} 
          {contentCreationMode === 'generate_from_topic' && (
            <div className="mb-6">
              <label htmlFor="topicOfBabyPodcast" className="block text-sm font-medium text-gray-300 mb-1.5">
                What is the podcast topic? <span className="text-xs text-gray-400">(Enter a topic, and the AI will generate a podcast script based on it.)</span>
              </label>
              <input
                type="text"
                id="topicOfBabyPodcast"
                name="topicOfBabyPodcast"
                placeholder="E.g. Politics, Economics, Trade, Global events..."
                value={topicOfBabyPodcast}
                onChange={handleTopicChange}
                className={`${inputBaseClasses} ${topicError ? 'border-red-500' : 'border-gray-700'}`}
                maxLength={MAX_TOPIC_LENGTH +1 }
              />
              <div className={charCountClasses}>
                {topicOfBabyPodcast.length}/{MAX_TOPIC_LENGTH}
              </div>
              {topicError && <p className={errorTextClasses}>{topicError}</p>}
            </div>
          )}

          {contentCreationMode === 'direct_text_input' && (
            <div className="mb-6">
              <label htmlFor="textScriptDirectInput" className="block text-sm font-medium text-gray-300 mb-1.5">
                Type or paste your script here <span className="text-xs text-gray-400">(Directly type or paste your complete podcast script here.)</span>
              </label>
              <div className="mb-2">
                {currentCredits > 0 ? (
                  <span className="text-xs text-gray-400">You can input up to {maxTextScriptLength} characters, based on your current credits.</span>
                ) : (
                  <span className="text-xs text-red-400">Insufficient credits to input text.</span>
                )}
              </div>
              <textarea
                id="textScriptDirectInput"
                name="textScriptDirectInput"
                rows={8}
                placeholder={`Enter your podcast script (max ${maxTextScriptLength} characters)...`}
                value={textScriptDirectInput}
                onChange={handleTextScriptDirectInputChange}
                className={`${inputBaseClasses} min-h-[150px] ${textScriptDirectInputError ? 'border-red-500' : 'border-gray-700'}`}
                maxLength={maxTextScriptLength > 0 ? maxTextScriptLength : 1}
                disabled={currentCredits === 0}
              />
              <div className={charCountClasses}>
                {textScriptDirectInput.length}/{maxTextScriptLength}
              </div>
              {textScriptDirectInputError && <p className={errorTextClasses}>{textScriptDirectInputError}</p>}
            </div>
          )}

          {contentCreationMode === 'audio_script' && (
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Upload Audio File <span className="text-xs text-gray-400">(Upload your pre-recorded audio script. The AI will process this audio.)</span>
              </label>
              <div className="mb-2">
                {currentCredits > 0 ? (
                  <span className="text-xs text-gray-400">You can upload up to {currentCredits} seconds of audio, based on your current credits.</span>
                ) : (
                  <span className="text-xs text-red-400">Insufficient credits to upload audio.</span>
                )}
              </div>
              <AudioTrimUpload onAudioReady={handleAudioTrimReady} maxDuration={currentCredits} />
              {audioScriptError && <p className={errorTextClasses}>{audioScriptError}</p>}
              {audioScriptFileBlob && (
                <div className="text-green-400 text-xs mt-1">Audio segment ready for upload: {audioScriptFileName}</div>
              )}
            </div>
          )}
        </div>

        {/* --- MODULE 3: Video Output Settings --- */}
        <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className={sectionTitleClasses}>Video Output Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 {/* Video Resolution Selector */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1.5">
                     Video Resolution
                   </label>
                   <div className="flex items-center space-x-4">
                     <label htmlFor="resolution540p" className="flex items-center cursor-pointer">
                       <input
                         type="radio"
                         id="resolution540p"
                         name="videoResolutionOption"
                         value="540p"
                         checked={videoResolution === '540p'}
                         onChange={handleVideoResolutionChange}
                         className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                       />
                       <span className="ml-2 text-sm text-gray-200">540p</span>
                     </label>
                     <label htmlFor="resolution720p" className="flex items-center cursor-pointer">
                       <input
                         type="radio"
                         id="resolution720p"
                         name="videoResolutionOption"
                         value="720p"
                         checked={videoResolution === '720p'}
                         onChange={handleVideoResolutionChange}
                         className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                       />
                       <span className="ml-2 text-sm text-gray-200">720p</span>
                       <span className="ml-1 text-xs text-yellow-400">(Consumes 2x credits)</span>
                     </label>
                   </div>
                 </div>

                 {/* Aspect Ratio Selector */}
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1.5">
                     Aspect Ratio
                   </label>
                   <div className="flex items-center space-x-4">
                     <label htmlFor="aspect9to16" className="flex items-center cursor-pointer">
                       <input
                         type="radio"
                         id="aspect9to16"
                         name="aspectRatioOption"
                         value="9:16"
                         checked={aspectRatio === '9:16'}
                         onChange={handleAspectRatioChange}
                         className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                       />
                       <span className="ml-2 text-sm text-gray-200">9:16</span>
                     </label>
                     <label htmlFor="aspect1to1" className="flex items-center cursor-pointer">
                       <input
                         type="radio"
                         id="aspect1to1"
                         name="aspectRatioOption"
                         value="1:1"
                         checked={aspectRatio === '1:1'}
                         onChange={handleAspectRatioChange}
                         className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                       />
                       <span className="ml-2 text-sm text-gray-200">1:1</span>
                     </label>
                     <label htmlFor="aspect16to9" className="flex items-center cursor-pointer">
                       <input
                         type="radio"
                         id="aspect16to9"
                         name="aspectRatioOption"
                         value="16:9"
                         checked={aspectRatio === '16:9'}
                         onChange={handleAspectRatioChange}
                         className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                       />
                       <span className="ml-2 text-sm text-gray-200">16:9</span>
                     </label>
                   </div>
                 </div>
               </div>
        </div>
        
        {submissionStatus.message && (
          <div 
            className={`mt-4 p-3 rounded-md text-sm ${
              submissionStatus.type === 'success' ? 'bg-green-800/50 text-green-300 border border-green-700' :
              submissionStatus.type === 'error' ? 'bg-red-800/50 text-red-300 border border-red-700' :
              'bg-blue-800/50 text-blue-300 border border-blue-700'
            }`}
          >
            {submissionStatus.message}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
            <Settings2 size={16} />
          </button>
          <button 
            className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors disabled:opacity-50"
            onClick={handleAICreatePress} 
            disabled={isSubmitButtonDisabled}
          >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Processing...' : 'AI Create'}</span>
          </button>
        </div>
      </section>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          executeSubmitLogic(); 
        }}
        title="Confirm Podcast Creation"
        message="Are you sure you want to proceed with creating this AI Baby Podcast?"
        confirmText="Yes, Create Now"
        cancelText="Cancel"
      />

      <InsufficientCreditsModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
      />

      {/* Explores & Examples Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
          <SearchCode size={24} className="mr-3 text-purple-400" />
          Explores & Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map(video => (
            <div key={video.id} className="bg-[#1c2128] p-4 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow">
              <div className="aspect-video overflow-hidden rounded-md mb-3">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?loop=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
                  title={video.title} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <h4 className="text-sm font-medium text-white truncate h-5"></h4> {/* Empty title, as per original */}
            </div>
          ))}
        </div>
      </section>

      {/* "My Projects" section has been removed */}

      {/* Recent Notifications Section */}
      {allReceivedNotifications.length > 0 && !isLoading && (
        <section className="bg-[#1c2128] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Notifications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allReceivedNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-md ${notification.isImportant ? 'bg-purple-800/60 border border-purple-600' : 'bg-[#161b22]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white">{notification.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{notification.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Global Loading Overlay (might be for initial page load or other global loading states) */}
      {isLoading && ( 
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      )}
    </div>
  );
}