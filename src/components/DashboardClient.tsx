'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings2, Sparkles, Film, SearchCode, ChevronDown } from 'lucide-react'; // Film might be unused now
import { ConfirmationModal } from './modals/ConfirmationModal';
import InsufficientCreditsModal from './modals/InsufficientCreditsModal';
import { useRouter } from 'next/navigation'; // Import useRouter

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
const REQUIRED_CREDITS_PER_PROJECT = 0; // Assuming this is correct, check if credits apply to custom uploads too

export default function DashboardClient({ currentCredits }: { currentCredits: number }) {
  const router = useRouter(); // Initialize useRouter
  const [allReceivedNotifications, setAllReceivedNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true); // This might need to be re-evaluated if My Projects is gone

  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [customEthnicity, setCustomEthnicity] = useState('');
  const [isEthnicityOther, setIsEthnicityOther] = useState(false);
  const [customEthnicityError, setCustomEthnicityError] = useState('');

  const [selectedHair, setSelectedHair] = useState('');
  const [customHair, setCustomHair] = useState('');
  const [isHairOther, setIsHairOther] = useState(false);
  const [customHairError, setCustomHairError] = useState('');

  const [topicOfBabyPodcast, setTopicOfBabyPodcast] = useState('');
  const [topicError, setTopicError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' | null }>({ message: '', type: null });

  // New state variables for creation mode and custom image upload
  const [creationMode, setCreationMode] = useState<'generate' | 'upload'>('generate');
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [customImageError, setCustomImageError] = useState<string>('');
  const [videoResolution, setVideoResolution] = useState<'540p' | '720p'>('540p');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('9:16');

  const handleRemoveCustomImage = () => {
    setCustomImageFile(null);
    setCustomImagePreview(null);
    setCustomImageError('');
    const fileInput = document.getElementById('custom-baby-image-input') as HTMLInputElement | null;
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

  // Handler for creation mode change
  const handleCreationModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as 'generate' | 'upload';
    setCreationMode(newMode);
    setSubmissionStatus({ message: '', type: null }); // Clear previous submission status

    if (newMode === 'generate') {
      setCustomImageFile(null);
      setCustomImagePreview(null);
      setCustomImageError('');
      // Reset feature fields to avoid carrying over state if user switches back and forth
      // setSelectedEthnicity(''); 
      // setCustomEthnicity('');
      // setIsEthnicityOther(false);
      // setCustomEthnicityError('');
      // setSelectedHair('');
      // setCustomHair('');
      // setIsHairOther(false);
      // setCustomHairError('');
    } else { // 'upload' mode
      // Clear feature-specific fields when switching to upload mode
      setSelectedEthnicity(''); 
      setCustomEthnicity('');
      setIsEthnicityOther(false);
      setCustomEthnicityError('');
      setSelectedHair('');
      setCustomHair('');
      setIsHairOther(false);
      setCustomHairError('');
    }
  };

  // Handler for custom image file change
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

  const handleVideoResolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoResolution(event.target.value as '540p' | '720p');
    setSubmissionStatus({ message: '', type: null });
  };

  const handleAspectRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAspectRatio(event.target.value as '1:1' | '16:9' | '9:16');
    setSubmissionStatus({ message: '', type: null });
  };

  const executeSubmitLogic = async () => {
    setIsSubmitting(true);
    setSubmissionStatus({ message: '✨ Processing your request...', type: 'info' }); 

    try {
      let response;
      let result;

      if (creationMode === 'generate') {
        const ethnicityValue = isEthnicityOther ? customEthnicity : selectedEthnicity;
        const hairValue = isHairOther ? customHair : selectedHair;
        const topicPayload = topicOfBabyPodcast;

        response = await fetch('/api/submit-podcast-idea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ethnicity: ethnicityValue,
            hair: hairValue,
            topic: topicPayload,
            videoResolution: videoResolution,
            aspectRatio: aspectRatio,
          }),
        });
        result = await response.json();

      } else { // creationMode === 'upload'
        if (!customImageFile) {
          setSubmissionStatus({ message: '⚠️ Please select an image to upload.', type: 'error' });
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('topic', topicOfBabyPodcast);
        formData.append('customBabyImage', customImageFile);
        formData.append('videoResolution', videoResolution);
        formData.append('aspectRatio', aspectRatio);

        response = await fetch('/api/submit-podcast-idea/upload-custom-image', { 
          method: 'POST',
          body: formData,
        });
        result = await response.json();
      }
      
      if (response.ok) {
        setSubmissionStatus({ 
          message: `✅ Your AI baby podcast request has been submitted. ${creationMode === 'generate' ? 'It is now being generated.' : 'The custom image has been processed.'} You can check "My Projects" later for updates. This usually takes about 3 minutes.`, 
          type: 'success' 
        });
        router.refresh(); 
        // Reset form fields
        setTopicOfBabyPodcast('');
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
        setVideoResolution('540p');
        setAspectRatio('9:16');
        // Consider resetting creationMode to 'generate' or leave as is based on desired UX
        // setCreationMode('generate'); 
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
    !!topicError ||
    !topicOfBabyPodcast.trim() ||
    (creationMode === 'generate' && (
      !!customEthnicityError || 
      !!customHairError || 
      (isEthnicityOther && !customEthnicity.trim()) || 
      (isHairOther && !customHair.trim()) || 
      (!isEthnicityOther && !selectedEthnicity) || 
      (!isHairOther && !selectedHair)
    )) ||
    (creationMode === 'upload' && (
      !customImageFile ||
      !!customImageError
    ));

  return (
    <div className="space-y-8">
      <section className="bg-[#161b22] p-6 rounded-lg shadow-md space-y-6">
        
        <div>
          <h3 className={sectionTitleClasses}>Baby&apos;s Appearance</h3>
          
          {/* Creation Mode Selector */}
          <div className="mb-6 mt-4"> {/* Added mt-4 for spacing */}
            <span className="block text-sm font-medium text-gray-300 mb-2">Creation Mode:</span>
            <div className="flex items-center space-x-4">
              <label htmlFor="generateMode" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="generateMode"
                  name="creationModeOption"
                  value="generate"
                  checked={creationMode === 'generate'}
                  onChange={handleCreationModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Generate with Features</span>
              </label>
              <label htmlFor="uploadMode" className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="uploadMode"
                  name="creationModeOption"
                  value="upload"
                  checked={creationMode === 'upload'}
                  onChange={handleCreationModeChange}
                  className="form-radio h-4 w-4 text-purple-600 border-gray-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-200">Upload Custom Image</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering based on creationMode */}
          {creationMode === 'generate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label htmlFor="babyEthnicity" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Ethnicity of the baby
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
                        maxLength={MAX_CUSTOM_FIELD_LENGTH + 1} // Allow one extra for error check
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
                  Baby hair
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
                        maxLength={MAX_CUSTOM_FIELD_LENGTH + 1} // Allow one extra for error check
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

          {creationMode === 'upload' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-baby-image" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Baby Image
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
                    name="customBabyImage"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCustomImageChange}
                    className="sr-only" // Hidden visually, triggered by the custom label
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
        </div>

        <div>
          <h3 className={sectionTitleClasses}>Topic of Baby Podcast</h3>
          <div>
            <label htmlFor="topicOfBabyPodcast" className="block text-sm font-medium text-gray-300 mb-1.5">
              Topic of Baby Podcast
            </label>
            <input
              type="text"
              id="topicOfBabyPodcast"
              name="topicOfBabyPodcast"
              placeholder="Enter the topic for the podcast..."
              value={topicOfBabyPodcast}
              onChange={handleTopicChange}
              className={`${inputBaseClasses} ${topicError ? 'border-red-500' : 'border-gray-700'}`}
            />
            <div className={charCountClasses}>
              {topicOfBabyPodcast.length}/{MAX_TOPIC_LENGTH}
            </div>
            {topicError && <p className={errorTextClasses}>{topicError}</p>}
          </div>

          {/* Combined Video Resolution and Aspect Ratio Section */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
      {isLoading && ( // This isLoading might need to be tied to a more specific loading state now
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      )}
    </div>
  );
}