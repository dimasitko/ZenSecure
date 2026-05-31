import DOMPurify from 'dompurify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  content: string;
  isOwnMessage: boolean;
}

export const SecureMessage = ({ content, isOwnMessage }: Props) => {
  const cleanHTML = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });

  return (
    <div className={cn("flex w-full", isOwnMessage ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-2xl text-sm",
          isOwnMessage 
            ? "bg-blue-600 text-white rounded-br-none" 
            : "bg-gray-800 text-gray-100 rounded-bl-none"
        )}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </div>
  );
};