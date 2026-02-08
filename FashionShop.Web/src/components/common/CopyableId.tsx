import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkCircle } from "react-icons/io5";

// Định nghĩa kiểu dữ liệu cho props (nếu dùng TypeScript)
interface CopyableIdProps {
    id: string;
}

const CopyableId = ({ id }: CopyableIdProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (ví dụ click vào row để xem chi tiết)
        
        // Copy vào clipboard
        navigator.clipboard.writeText(id);
        setIsCopied(true);
        
        // Reset lại trạng thái sau 2 giây
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Nếu id null hoặc undefined thì không render gì cả để tránh lỗi
    if (!id) return null;

    return (
        <div 
            className="flex items-center gap-2 mt-1 group/id cursor-pointer w-fit" 
            onClick={handleCopy}
        >
            {/* Text ID rút gọn */}
            <p 
                className="text-[11px] font-mono text-gray-400 group-hover/id:text-indigo-500 transition-colors select-none" 
                title={id} // Tooltip native
            >
                #{id.substring(0, 6)}...{id.substring(id.length - 4)}
            </p>

            {/* Nút Copy */}
            <div className="relative opacity-0 group-hover/id:opacity-100 transition-opacity duration-200">
                {isCopied ? (
                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-md animate-in fade-in zoom-in duration-200">
                        <IoCheckmarkCircle className="text-sm" />
                        <span>Đã copy</span>
                    </div>
                ) : (
                    <button 
                        type="button"
                        className="p-1 rounded bg-gray-100 text-gray-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                        title="Sao chép ID"
                    >
                        <IoCopyOutline className="text-[10px]" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CopyableId;