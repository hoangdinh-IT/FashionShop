import React, { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoCloseOutline, IoCloudUploadOutline, IoTrashOutline, IoColorPaletteOutline, IoSaveOutline } from 'react-icons/io5';
import { MdDragIndicator } from 'react-icons/md';
import { useProductColors, useProductDetail } from '../hooks/useProducts';
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useProductImageMutations } from '../hooks/useProductImages';
import type { ProductImage } from '../types/product';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
}

// Mở rộng interface để dùng chung cho cả ảnh API và ảnh Preview
interface DisplayImage extends Partial<ProductImage> {
    id: string;
    imageUrl: string;
    colorId: number | null;
    colorName?: string;
    colorHexCode?: string;
    sortOrder: number;
    isPreview?: boolean; // Cờ đánh dấu ảnh chưa lưu
    file?: File; // Lưu trữ file thật để lát nữa gọi API
}

const ProductImageManagerDialog: React.FC<Props> = ({ isOpen, onClose, productId }) => {
    const [selectedColorForUpload, setSelectedColorForUpload] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | number | null>('ALL');

    // State & Ref cho chức năng Upload File (Kéo thả)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // State lưu trữ các ảnh preview tạm thời
    const [previewImages, setPreviewImages] = useState<DisplayImage[]>([]);
    const [isSaving, setIsSaving] = useState(false); // Thêm state loading khi đang lưu

    const { productDetail } = useProductDetail(productId);
    const { colors } = useProductColors(productId);
    const { 
        productImages,
        createProductImage,
        isCreatingProductImage,
    } = useProductImageMutations(productId);

    // ==========================================
    // CLEANUP EFFECTS
    // ==========================================
    // Xóa URL tạm khỏi bộ nhớ khi đóng Modal để tránh rò rỉ bộ nhớ (Memory Leak)
    useEffect(() => {
        if (!isOpen) {
            previewImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
            setPreviewImages([]);
            setSelectedColorForUpload(null);
            setActiveTab('ALL');
        }
    }, [isOpen]);

    // ==========================================
    // CÁC HÀM XỬ LÝ UPLOAD FILE & KÉO THẢ
    // ==========================================
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const processFiles = (files: FileList | File[]) => {
        const validFiles: File[] = [];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

        Array.from(files).forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert(`File ${file.name} không đúng định dạng. Chỉ hỗ trợ JPG, PNG, WEBP, AVIF.`);
                return;
            }
            if (file.size > maxSize) {
                alert(`File ${file.name} vượt quá 5MB.`);
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length > 0) {
            const selectedColorObj = colors.find(c => c.id === selectedColorForUpload);
            
            // Tạo mảng ảnh preview
            const newPreviews: DisplayImage[] = validFiles.map((file, index) => ({
                id: `preview-${Date.now()}-${index}`, // Tạo ID tạm
                imageUrl: URL.createObjectURL(file), // Tạo URL tạm để hiển thị
                colorId: selectedColorForUpload,
                colorName: selectedColorObj?.name,
                colorHexCode: selectedColorObj?.hexCode,
                sortOrder: 999, // Cho xuống cuối
                isPreview: true,
                file: file
            }));

            setPreviewImages(prev => [...prev, ...newPreviews]);
            
            // Tự động chuyển Tab sang màu vừa upload để người dùng thấy ngay
            setActiveTab(selectedColorForUpload === null ? null : selectedColorForUpload);
        }
    };

    const handleRemovePreview = (idToRemove: string) => {
        setPreviewImages(prev => {
            const imageToRemove = prev.find(img => img.id === idToRemove);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.imageUrl); // Giải phóng RAM
            }
            return prev.filter(img => img.id !== idToRemove);
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset để có thể chọn lại file cũ
        }
    };

    // ==========================================
    // HÀM LƯU THAY ĐỔI LÊN SERVER
    // ==========================================
    const handleSaveChanges = async (productId: string) => {
        if (previewImages.length === 0 || !productId) return;
        setIsSaving(true);

        try {
            // 1. GOM NHÓM ẢNH THEO MÀU SẮC (ColorId)
            // Kết quả sẽ tạo ra object dạng: { "null": [file1, file2], "5": [file3, file4] }
            const groupedImages = previewImages.reduce((acc, preview) => {
                if (!preview.file) return acc;
                
                // Dùng string 'null' làm key cho các ảnh chung, nếu có colorId thì dùng ID đó làm key
                const key = preview.colorId === null ? 'null' : String(preview.colorId);
                
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(preview);
                return acc;
            }, {} as Record<string, typeof previewImages>);

            // 2. TẠO REQUEST CHO TỪNG NHÓM MÀU SẮC
            const uploadPromises = Object.values(groupedImages).map(imageGroup => {
                const formData = new FormData();
                const colorId = imageGroup[0].colorId;

                // Truyền ProductId vào FormData (Vì DTO của bạn yêu cầu [Required] ProductId)
                formData.append("ProductId", productId);

                // Truyền ColorId nếu có
                if (colorId !== null && colorId !== undefined) {
                    formData.append("ColorId", String(colorId));
                }

                // Truyền mảng Images (Lặp qua nhóm ảnh để nhét tất cả vào key "Images")
                imageGroup.forEach(preview => {
                    if (preview.file) {
                        // Chú ý: Backend C# List<IFormFile> mặc định sẽ nhận khi append cùng 1 tên key nhiều lần
                        formData.append("Images", preview.file);
                    }
                });

                // 3. GỌI API BẰNG PROMISE
                return new Promise((resolve, reject) => {
                    createProductImage({ productId, formData }, {
                        onSuccess: (res: any) => resolve(res),
                        onError: (err: any) => reject(err)
                    });
                });
            });

            // Đợi tất cả các nhóm màu sắc được upload xong
            await Promise.all(uploadPromises);

            // 4. CLEANUP SAU KHI THÀNH CÔNG
            previewImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
            setPreviewImages([]);
            
            // Bạn có thể thêm thông báo thành công ở đây (VD: toast.success(...))
            
        } catch (error) {
            console.error("Lỗi khi lưu hình ảnh:", error);
            alert("Có lỗi xảy ra trong quá trình lưu ảnh. Vui lòng kiểm tra lại.");
        } finally {
            setIsSaving(false);
        }
    };

    // ==========================================
    // RENDER DATA (Gộp ảnh API và ảnh Preview)
    // ==========================================
    const allDisplayImages = [...productImages, ...previewImages] as DisplayImage[];

    // ==========================================
    // ANIMATION VARIANTS
    // ==========================================
    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 },
        },
        exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
                            {/* BACKDROP */}
                            <Dialog.Overlay asChild>
                                <motion.div
                                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                                    variants={backdropVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                />
                            </Dialog.Overlay>

                            {/* MODAL CONTENT */}
                            <Dialog.Content asChild>
                                <motion.div
                                    className="relative w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                                    variants={modalVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {/* --- HEADER --- */}
                                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <Dialog.Title className="text-2xl font-bold text-slate-900">Quản lý thư viện hình ảnh</Dialog.Title>
                                            <Dialog.Description className="text-slate-500 mt-1 font-medium">
                                                Sản phẩm: {productDetail?.name || 'Đang tải...'}
                                            </Dialog.Description>
                                        </div>
                                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors focus:outline-none">
                                            <IoCloseOutline className="text-2xl" />
                                        </button>
                                    </div>

                                    {/* --- BODY --- */}
                                    <div className="flex-1 flex overflow-hidden">
                                        {/* 1. LEFT PANEL: Upload & Configuration */}
                                        <div className="w-1/3 p-8 border-r border-slate-100 space-y-8 overflow-y-auto bg-slate-50/50">
                                            {/* Cấu hình màu sắc trước khi upload */}
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                                    <IoColorPaletteOutline className="text-indigo-500" />
                                                    Áp dụng ảnh cho màu sắc:
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => setSelectedColorForUpload(null)}
                                                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selectedColorForUpload === null ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                    >
                                                        Ảnh chung
                                                    </button>
                                                    {colors?.map(color => (
                                                        <button
                                                            key={color.id}
                                                            onClick={() => setSelectedColorForUpload(color.id)}
                                                            className={`px-4 py-3 rounded-xl border-2 flex items-center gap-2.5 text-sm font-medium transition-all ${selectedColorForUpload === color.id ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                        >
                                                            <span className="w-4 h-4 rounded-full border border-slate-900/10" style={{ backgroundColor: color.hexCode }} />
                                                            {color.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-400 pt-1">Hình ảnh tải lên sẽ tự động được gắn với màu sắc bạn chọn ở trên.</p>
                                            </div>

                                            {/* Khu vực Drag & Drop Upload */}
                                            <div className="space-y-3">
                                                <label className="text-base font-semibold text-slate-800">Tải lên hình ảnh mới</label>
                                                
                                                {/* Input file ẩn */}
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={handleFileInputChange}
                                                    multiple 
                                                    accept="image/png, image/jpeg, image/webp, image/avif" 
                                                    className="hidden" 
                                                />

                                                {/* Dropzone Area */}
                                                <div 
                                                    onClick={handleUploadClick}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center group transition-all cursor-pointer
                                                        ${isDragging 
                                                            ? 'border-indigo-500 bg-indigo-50' 
                                                            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
                                                        }
                                                    `}
                                                >
                                                    <div className={`p-4 rounded-full transition-colors mb-4 
                                                        ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}
                                                    >
                                                        <IoCloudUploadOutline className="text-3xl" />
                                                    </div>
                                                    <p className={`font-semibold transition-colors 
                                                        ${isDragging ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'}`}
                                                    >
                                                        {isDragging ? 'Thả hình ảnh vào đây!' : 'Kéo thả hình ảnh vào đây'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mt-1 mb-4">hoặc click để chọn file từ máy tính</p>
                                                    
                                                    <button type="button" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors pointer-events-none">
                                                        Chọn tệp
                                                    </button>
                                                    
                                                    <p className="text-xs text-slate-400 mt-5">Hỗ trợ: PNG, JPG, WEBP. Tối đa 5MB/ảnh. Tự động tối ưu dung lượng.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. RIGHT PANEL: Gallery & Management */}
                                        <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                            {/* Tabs Phân loại ảnh theo màu */}
                                            <div className="px-8 pt-6 pb-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
                                                <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')}>Tất cả ({allDisplayImages.length})</TabButton>
                                                <TabButton active={activeTab === null} onClick={() => setActiveTab(null)}>Ảnh chung</TabButton>
                                                {colors?.map(color => {
                                                    const count = allDisplayImages.filter(img => img.colorId === color.id).length;
                                                    return (
                                                        <TabButton key={color.id} active={activeTab === color.id} onClick={() => setActiveTab(color.id)}>
                                                            <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: color.hexCode }} />
                                                            {color.name} ({count})
                                                        </TabButton>
                                                    )
                                                })}
                                            </div>

                                            {/* Grid hiển thị hình ảnh */}
                                            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                                    {allDisplayImages
                                                        .filter(img => activeTab === 'ALL' || img.colorId === activeTab)
                                                        .sort((a, b) => {
                                                            // Đẩy ảnh preview xuống cuối cùng, nếu cùng là ảnh cũ thì xếp theo sortOrder
                                                            if (a.isPreview && !b.isPreview) return 1;
                                                            if (!a.isPreview && b.isPreview) return -1;
                                                            return (a.sortOrder || 0) - (b.sortOrder || 0);
                                                        })
                                                        .map((img) => (
                                                            <ImageCard
                                                                key={img.id}
                                                                img={img}
                                                                onRemovePreview={handleRemovePreview}
                                                            />
                                                        ))}

                                                    {/* Nút thêm nhanh */}
                                                    <div 
                                                        onClick={() => {
                                                            if (activeTab !== 'ALL') setSelectedColorForUpload(activeTab);
                                                            handleUploadClick();
                                                        }}
                                                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-white transition-all cursor-pointer space-y-2"
                                                    >
                                                        <IoCloudUploadOutline className="text-2xl" />
                                                        <span className="text-xs font-medium px-2">Thêm nhanh ảnh</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- FOOTER --- */}
                                    <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            {previewImages.length > 0 ? (
                                                <span className="text-indigo-600 flex items-center gap-1.5">
                                                    <IoSaveOutline className="text-lg" />
                                                    Bạn có {previewImages.length} ảnh mới chưa được lưu
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    Mọi thay đổi về thứ tự ảnh sẽ được tự động lưu.
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={onClose} 
                                                disabled={isSaving || isCreatingProductImage}
                                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                            >
                                                Đóng
                                            </button>
                                            <button 
                                                onClick={() => handleSaveChanges(productId)}
                                                disabled={previewImages.length === 0 || isSaving || isCreatingProductImage}
                                                className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSaving || isCreatingProductImage ? "Đang lưu..." : `Lưu thay đổi (${previewImages.length})`}
                                            </button>
                                        </div>
                                    </div>

                                </motion.div>
                            </Dialog.Content>
                        </div>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

// --- Sub-Components ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center transition-all relative ${active ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
    >
        {children}
        {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>}
    </button>
)

const ImageCard: React.FC<{ img: DisplayImage, onRemovePreview: (id: string) => void }> = ({ img, onRemovePreview }) => {
    return (
        <div className={`aspect-square rounded-2xl overflow-hidden group border bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative ${img.isPreview ? 'border-teal-400 ring-2 ring-teal-400/20' : 'border-slate-100 hover:border-slate-200'}`}>
            <img
                src={img.imageUrl}
                alt={img.colorName ? `Sản phẩm màu ${img.colorName}` : "Hình ảnh sản phẩm"}
                className={`w-full h-full object-cover transition-transform duration-500 ${img.isPreview ? 'opacity-90' : 'group-hover:scale-105'}`}
            />
            
            {/* Lớp phủ hành động */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                <div className="flex items-center justify-between gap-2">
                    <div title="Kéo thả để đổi thứ tự" className={`p-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white/70 ${img.isPreview ? 'cursor-not-allowed opacity-50' : 'hover:text-white cursor-grab active:cursor-grabbing'}`}>
                        <MdDragIndicator className="text-lg" />
                    </div>
                    {img.colorName && (
                        <div className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm flex items-center gap-1.5 text-xs font-bold text-white">
                            {img.colorHexCode && <span className="w-2 h-2 rounded-full border border-white/50" style={{ backgroundColor: img.colorHexCode }} />}
                            {img.colorName}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-center gap-2">
                    <button 
                        title={img.isPreview ? "Hủy chọn ảnh này" : "Xóa hình ảnh này"} 
                        onClick={() => img.isPreview ? onRemovePreview(img.id) : console.log("Gọi API xóa ảnh")}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white/70 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <IoTrashOutline className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Badge cho ảnh chưa lưu */}
            {img.isPreview ? (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-teal-500 text-white text-[10px] font-bold shadow-sm animate-pulse">
                    CHƯA LƯU
                </div>
            ) : (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 text-xs font-extrabold text-slate-800 shadow group-hover:opacity-0 transition-opacity">
                    {img.sortOrder}
                </div>
            )}
        </div>
    );
}

export default ProductImageManagerDialog;