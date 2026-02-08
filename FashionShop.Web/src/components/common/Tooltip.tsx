import React, { useState, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    title?: string;      // Thêm prop tiêu đề (tuỳ chọn)
    headerIcon?: ReactNode; // Thêm prop icon tiêu đề (tuỳ chọn)
}

const Tooltip: React.FC<TooltipProps> = ({ 
    content, 
    children, 
    title = "Thông tin", // Giá trị mặc định
    headerIcon 
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [coords, setCoords] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                left: rect.left + rect.width / 2,
                top: rect.top - 12, // Nhích lên cao hơn một chút
            });
            setIsVisible(true);
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block relative" // Thêm relative
            >
                {children}
            </div>

            {isVisible &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed z-[9999] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" // Animation mượt hơn
                        style={{
                            left: coords.left,
                            top: coords.top,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="relative flex flex-col items-center mb-3 animate-in fade-in zoom-in-95 duration-200">
                            {/* BODY TOOLTIP */}
                            <div className="relative w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 p-0 overflow-hidden ring-1 ring-black/5">
                                
                                {/* Header: Gradient nhẹ để tạo điểm nhấn hiện đại */}
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2.5">
                                    <div className="text-indigo-500 flex items-center justify-center bg-white p-1 rounded-md shadow-sm border border-gray-100">
                                        {headerIcon || <span className="text-xs">ℹ️</span>} 
                                    </div>
                                    <span className="font-bold text-[11px] uppercase text-gray-500 tracking-wider">
                                        {title}
                                    </span>
                                </div>
                                
                                {/* Content */}
                                <div className="px-4 py-3 text-sm leading-relaxed font-medium text-gray-600">
                                    {content}
                                </div>
                            </div>

                            {/* Mũi tên (Arrow) */}
                            <div className="w-4 h-4 bg-white transform rotate-45 -translate-y-[8px] border-r border-b border-gray-100 shadow-sm z-10"></div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default Tooltip;