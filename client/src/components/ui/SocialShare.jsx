
import React, { useState } from 'react';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share';
import {
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
} from 'react-icons/fa6';
import { FiLink, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SocialShare = ({ title, url, vertical = false }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Article link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Unable to copy link.');
    }
  };

  const containerClasses = vertical
    ? 'flex flex-col items-center gap-2.5'
    : 'flex flex-wrap items-center gap-2';

  const buttonBase =
    'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 text-sm shadow-sm';

  return (
    <div className={containerClasses}>

      <TwitterShareButton url={shareUrl} title={title}>
        <div className={`${buttonBase} bg-black hover:bg-gray-800 text-white`} title="Share on X">
          <FaXTwitter className="w-3.5 h-3.5" />
        </div>
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} title={title}>
        <div className={`${buttonBase} bg-[#0077b5] hover:bg-[#006097] text-white`} title="Share on LinkedIn">
          <FaLinkedinIn className="w-3.5 h-3.5" />
        </div>
      </LinkedinShareButton>

      <FacebookShareButton url={shareUrl} quote={title}>
        <div className={`${buttonBase} bg-[#1877f2] hover:bg-[#0d65d9] text-white`} title="Share on Facebook">
          <FaFacebookF className="w-3.5 h-3.5" />
        </div>
      </FacebookShareButton>

      <WhatsappShareButton url={shareUrl} title={title}>
        <div className={`${buttonBase} bg-[#25d366] hover:bg-[#20ba5a] text-white`} title="Share on WhatsApp">
          <FaWhatsapp className="w-4 h-4" />
        </div>
      </WhatsappShareButton>

      <button
        type="button"
        onClick={handleCopyLink}
        className={`${buttonBase} ${
          copied ? 'bg-neutral-900 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Copy article link"
        aria-label="Copy article link"
      >
        {copied ? <FiCheck className="w-4 h-4" /> : <FiLink className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialShare;
