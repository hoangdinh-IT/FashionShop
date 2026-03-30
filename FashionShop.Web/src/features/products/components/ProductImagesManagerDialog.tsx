import React, { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoCloseOutline, IoCloudUploadOutline, IoTrashOutline, IoColorPaletteOutline, IoSaveOutline } from 'react-icons/io5';
import { MdDragIndicator } from 'react-icons/md';

import { useProductColors, useProductDetail } from '../hooks/useProducts';
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useProductImageMutations, useProductImages } from '../hooks/useProductImages';
import type { ProductImage } from '../types/product';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productId?: string;
}

interface DisplayImage extends Partial<ProductImage> {
    id: string;
    imageUrl: string;
    colorId: number | null;
    colorName?: string;
    colorHexCode?: string;
    sortOrder: number;
    isPreview?: boolean;
    file?: File;
}

const ProductImageManagerDialog: React.FC<Props> = ({ isOpen, onClose, productId }) => {
    const [selectedColorForUpload, setSelectedColorForUpload] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | number | null>('ALL');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // ==========================================
    // STATES LƯU TRỮ THAY ĐỔI
    // ==========================================
    const [previewImages, setPreviewImages] = useState<DisplayImage[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
    const [localSortOrders, setLocalSortOrders] = useState<Record<string, number>>({});
    
    // States phục vụ hiệu ứng kéo thả
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    
    const [isSaving, setIsSaving] = useState(false);

    const { productDetail } = useProductDetail(productId);
    const { colors } = useProductColors(productId);
    
    const {
        createProductImage,
        isCreatingProductImage,
        deleteProductImages,
        isDeletingProductImages,
        updateSortOrder, // API cập nhật thứ tự
        isUpdatingSortOrder
    } = useProductImageMutations();

    const { productImages } = useProductImages(productId);

    // ==========================================
    // CLEANUP EFFECTS
    // ==========================================
    useEffect(() => {
        if (!isOpen) {
            previewImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
            setPreviewImages([]);
            setDeletedImageIds([]);
            setLocalSortOrders({});
            setSelectedColorForUpload(null);
            setActiveTab('ALL');
        }
    }, [isOpen]);

    const handleUploadClick = () => fileInputRef.current?.click();

    const processFiles = (files: FileList | File[]) => {
        const validFiles: File[] = [];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

        Array.from(files).forEach((file) => {
            if (!allowedTypes.includes(file.type)) { alert(`File ${file.name} không đúng định dạng.`); return; }
            if (file.size > maxSize) { alert(`File ${file.name} vượt quá 5MB.`); return; }
            validFiles.push(file);
        });

        if (validFiles.length > 0) {
            const selectedColorObj = colors?.find(c => c.id === selectedColorForUpload);
            const newPreviews: DisplayImage[] = validFiles.map((file, index) => ({
                id: `preview-${Date.now()}-${index}`,
                imageUrl: URL.createObjectURL(file),
                colorId: selectedColorForUpload,
                colorName: selectedColorObj?.name,
                colorHexCode: selectedColorObj?.hexCode,
                sortOrder: 999,
                isPreview: true,
                file: file
            }));

            setPreviewImages(prev => [...prev, ...newPreviews]);
            setActiveTab(selectedColorForUpload === null ? null : selectedColorForUpload);
        }
    };

    const handleRemovePreview = (idToRemove: string) => {
        setPreviewImages(prev => {
            const imageToRemove = prev.find(img => img.id === idToRemove);
            if (imageToRemove) URL.revokeObjectURL(imageToRemove.imageUrl);
            return prev.filter(img => img.id !== idToRemove);
        });
    };

    const handleRemoveSavedImage = (imageId: string) => setDeletedImageIds(prev => [...prev, imageId]);

    const handleDragOverArea = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeaveArea = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDropArea = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) processFiles(e.dataTransfer.files);
    };
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) processFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ==========================================
    // RENDER DATA & LOGIC SẮP XẾP MỚI
    // ==========================================
    const activeProductImages = productImages?.filter(img => !deletedImageIds.includes(img.id)) || [];
    const allDisplayImages = [...activeProductImages, ...previewImages] as DisplayImage[];

    const sortedGridImages = allDisplayImages
        .filter(img => activeTab === 'ALL' || img.colorId === activeTab)
        .sort((a, b) => {
            const hasA = localSortOrders[a.id] !== undefined;
            const hasB = localSortOrders[b.id] !== undefined;

            if (hasA && hasB) return localSortOrders[a.id] - localSortOrders[b.id];
            if (hasA && !hasB) return -1;
            if (!hasA && hasB) return 1;

            if (a.colorId !== b.colorId) {
                if (a.colorId === null) return -1;
                if (b.colorId === null) return 1;
                return (a.colorId || 0) - (b.colorId || 0);
            }
            if (a.isPreview && !b.isPreview) return 1;
            if (!a.isPreview && b.isPreview) return -1;
            return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

    const handleCardDrop = (sourceId: string, targetId: string) => {
        setDraggedId(null);
        setDragOverId(null);
        if (sourceId === targetId) return;

        const currentSorted = [...sortedGridImages];
        const oldIndex = currentSorted.findIndex(img => img.id === sourceId);
        const newIndex = currentSorted.findIndex(img => img.id === targetId);

        if (oldIndex === -1 || newIndex === -1) return;

        const [movedItem] = currentSorted.splice(oldIndex, 1);
        currentSorted.splice(newIndex, 0, movedItem);

        const newSortOrders = { ...localSortOrders };
        currentSorted.forEach((img, index) => {
            newSortOrders[img.id] = index;
        });
        setLocalSortOrders(newSortOrders);
    };

    // ==========================================
    // HÀM LƯU TẤT CẢ THAY ĐỔI LÊN SERVER
    // ==========================================
    const handleSaveChanges = async () => {
        if (!productId) return;
        setIsSaving(true);
        try {
            // 1. XOÁ ẢNH
            if (deletedImageIds.length > 0) {
                try {
                    await deleteProductImages({ productId: productId, request: { imageIds: deletedImageIds } });
                } catch (error) { alert("Có lỗi xảy ra khi xoá ảnh cũ, vui lòng thử lại!"); setIsSaving(false); return; }
            }

            // 2. THÊM ẢNH MỚI
            if (previewImages.length > 0) {
                const groupedImages = previewImages.reduce((acc, preview) => {
                    if (!preview.file) return acc;
                    const key = preview.colorId === null ? 'null' : String(preview.colorId);
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(preview);
                    return acc;
                }, {} as Record<string, typeof previewImages>);

                const uploadPromises = Object.values(groupedImages).map(async (imageGroup) => {
                    const formData = new FormData();
                    const colorId = imageGroup[0].colorId;
                    formData.append("ProductId", productId);
                    if (colorId !== null && colorId !== undefined) formData.append("ColorId", String(colorId));
                    imageGroup.forEach(preview => { if (preview.file) formData.append("Images", preview.file); });
                    try {
                        await createProductImage({ productId, formData });
                        return { status: 'fulfilled' };
                    } catch (error) { return { status: 'rejected', error }; }
                });

                const results = await Promise.all(uploadPromises);
                if (results.some(r => r.status === 'rejected')) alert("Đã lưu nhưng có một vài ảnh bị lỗi tải lên. Vui lòng kiểm tra lại!");
            }

            // 3. CẬP NHẬT LẠI THỨ TỰ (Chỉ áp dụng cho các ảnh đã có sẵn trong DB)
            if (Object.keys(localSortOrders).length > 0) {
                // Sắp xếp lại danh sách ảnh gốc (loại trừ ảnh đang chờ xoá) theo thứ tự người dùng vừa kéo
                const existingImagesToSort = [...activeProductImages].sort((a, b) => {
                    const hasA = localSortOrders[a.id] !== undefined;
                    const hasB = localSortOrders[b.id] !== undefined;

                    if (hasA && hasB) return localSortOrders[a.id] - localSortOrders[b.id];
                    if (hasA && !hasB) return -1;
                    if (!hasA && hasB) return 1;
                    
                    return (a.sortOrder || 0) - (b.sortOrder || 0);
                });

                // Gom nhóm các ảnh này theo từng màu (ColorId)
                const sortGroups = existingImagesToSort.reduce((acc, img) => {
                    const key = img.colorId === null ? 'null' : String(img.colorId);
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(img.id);
                    return acc;
                }, {} as Record<string, string[]>);

                // Tạo mảng gọi API cập nhật cho từng màu
                const sortPromises = Object.entries(sortGroups).map(async ([colorKey, imageIds]) => {
                    // Kiểm tra: Chỉ gọi API nếu trong nhóm màu này có ít nhất 1 ảnh bị thay đổi vị trí
                    const hasChangesInThisColor = imageIds.some(id => localSortOrders[id] !== undefined);
                    if (!hasChangesInThisColor) return { status: 'fulfilled' };

                    const colorId = colorKey === 'null' ? undefined : Number(colorKey);
                    
                    try {
                        await updateSortOrder({
                            productId: productId,
                            request: {
                                colorId: colorId,
                                imageIds: imageIds // Trả đúng mảng ID theo thứ tự mới cho Backend tự phân bổ
                            }
                        });
                        return { status: 'fulfilled' };
                    } catch (error) {
                        return { status: 'rejected', error };
                    }
                });

                const sortResults = await Promise.all(sortPromises);
                if (sortResults.some(r => r.status === 'rejected')) {
                    alert("Có lỗi khi cập nhật thứ tự một số hình ảnh!");
                }
            }

            // 4. RESET STATE SAU KHI LƯU XONG
            setDeletedImageIds([]);
            previewImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
            setPreviewImages([]);
            setLocalSortOrders({}); 

        } catch (error) { alert("Có lỗi bất ngờ xảy ra!"); } 
        finally { setIsSaving(false); }
    };

    const hasChanges = previewImages.length > 0 || deletedImageIds.length > 0 || Object.keys(localSortOrders).length > 0;
    const isProcessing = isSaving || isCreatingProductImage || isDeletingProductImages || isUpdatingSortOrder;

    const backdropVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 } };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
                            <Dialog.Overlay asChild><motion.div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" /></Dialog.Overlay>
                            <Dialog.Content asChild>
                                <motion.div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                                    {/* --- HEADER --- */}
                                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                        <div><Dialog.Title className="text-2xl font-bold text-slate-900">Quản lý thư viện hình ảnh</Dialog.Title><Dialog.Description className="text-slate-500 mt-1 font-medium">Sản phẩm: {productDetail?.name || 'Đang tải...'}</Dialog.Description></div>
                                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"><IoCloseOutline className="text-2xl" /></button>
                                    </div>

                                    {/* --- BODY --- */}
                                    <div className="flex-1 flex overflow-hidden">
                                        <div className="w-1/3 p-8 border-r border-slate-100 space-y-8 overflow-y-auto bg-slate-50/50">
                                            {/* Form chọn màu & Kéo thả tải lên */}
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-base font-semibold text-slate-800"><IoColorPaletteOutline className="text-indigo-500" /> Áp dụng ảnh cho màu sắc:</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button onClick={() => setSelectedColorForUpload(null)} className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selectedColorForUpload === null ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>Ảnh chung</button>
                                                    {colors?.map(color => (
                                                        <button key={color.id} onClick={() => setSelectedColorForUpload(color.id)} className={`px-4 py-3 rounded-xl border-2 flex items-center gap-2.5 text-sm font-medium transition-all ${selectedColorForUpload === color.id ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                                            <span className="w-4 h-4 rounded-full border border-slate-900/10" style={{ backgroundColor: color.hexCode }} />{color.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-base font-semibold text-slate-800">Tải lên hình ảnh mới</label>
                                                <input type="file" ref={fileInputRef} onChange={handleFileInputChange} multiple accept="image/png, image/jpeg, image/webp, image/avif" className="hidden" />
                                                <div onClick={handleUploadClick} onDragOver={handleDragOverArea} onDragLeave={handleDragLeaveArea} onDrop={handleDropArea} className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center group transition-all cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                                                    <div className={`p-4 rounded-full transition-colors mb-4 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}><IoCloudUploadOutline className="text-3xl" /></div>
                                                    <p className={`font-semibold transition-colors ${isDragging ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'}`}>{isDragging ? 'Thả hình ảnh vào đây!' : 'Kéo thả hình ảnh vào đây'}</p>
                                                    <p className="text-sm text-slate-500 mt-1 mb-4">hoặc click để chọn file từ máy tính</p>
                                                    <button type="button" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors pointer-events-none">Chọn tệp</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                            <div className="px-8 pt-6 pb-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
                                                <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')}>Tất cả ({allDisplayImages.length})</TabButton>
                                                <TabButton active={activeTab === null} onClick={() => setActiveTab(null)}>Ảnh chung ({allDisplayImages.filter(img => img.colorId === null).length})</TabButton>
                                                {colors?.map(color => (
                                                    <TabButton key={color.id} active={activeTab === color.id} onClick={() => setActiveTab(color.id)}>
                                                        <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: color.hexCode }} />
                                                        {color.name} ({allDisplayImages.filter(img => img.colorId === color.id).length})
                                                    </TabButton>
                                                ))}
                                            </div>

                                            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                                    
                                                    {sortedGridImages.map((img) => (
                                                        <ImageCard
                                                            key={img.id}
                                                            img={img}
                                                            onRemovePreview={handleRemovePreview}
                                                            onRemoveSaved={handleRemoveSavedImage}
                                                            
                                                            draggedId={draggedId}
                                                            dragOverId={dragOverId}
                                                            onDragStart={(id) => setDraggedId(id)}
                                                            onDragOver={(id) => { if (id !== draggedId) setDragOverId(id) }}
                                                            onDragLeave={() => setDragOverId(null)}
                                                            onDrop={handleCardDrop}
                                                            onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                                                        />
                                                    ))}

                                                    <div onClick={() => { if (activeTab !== 'ALL') setSelectedColorForUpload(activeTab); handleUploadClick(); }} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-white transition-all cursor-pointer space-y-2">
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
                                            {hasChanges ? (
                                                <span className="text-indigo-600 flex items-center gap-1.5 font-semibold">
                                                    <IoSaveOutline className="text-lg" />
                                                    Đã có sự thay đổi. Bạn chưa lưu!
                                                </span>
                                            ) : (
                                                <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span> Mọi thay đổi về thứ tự ảnh sẽ được tự động lưu.</>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={onClose} disabled={isProcessing} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50">Đóng</button>
                                            <button onClick={handleSaveChanges} disabled={!hasChanges || isProcessing} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                                {isProcessing ? "Đang xử lý..." : "Lưu thay đổi"}
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
    <button onClick={onClick} className={`whitespace-nowrap px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center transition-all relative ${active ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>
        {children}{active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>}
    </button>
)

interface ImageCardProps {
    img: DisplayImage;
    onRemovePreview: (id: string) => void;
    onRemoveSaved: (id: string) => void;
    draggedId?: string | null;
    dragOverId?: string | null;
    onDragStart?: (id: string) => void;
    onDragOver?: (id: string) => void;
    onDragLeave?: () => void;
    onDrop?: (sourceId: string, targetId: string) => void;
    onDragEnd?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
    img, onRemovePreview, onRemoveSaved,
    draggedId, dragOverId, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd 
}) => {
    
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', img.id);
        e.dataTransfer.effectAllowed = 'move';
        if (onDragStart) onDragStart(img.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (e.dataTransfer.types.includes('Files')) return; 
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (onDragOver) onDragOver(img.id);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (e.dataTransfer.types.includes('Files')) return;
        e.preventDefault();
        const sourceId = e.dataTransfer.getData('text/plain');
        if (onDrop) onDrop(sourceId, img.id);
    };

    const isDragging = draggedId === img.id;
    const isDragOver = dragOverId === img.id;

    return (
        <div 
            draggable 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            onDragEnd={onDragEnd}
            className={`aspect-square rounded-2xl overflow-hidden group border bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative cursor-grab active:cursor-grabbing
                ${img.isPreview ? 'border-teal-400 ring-2 ring-teal-400/20' : 'border-slate-100 hover:border-slate-200'}
                ${isDragging ? 'opacity-40 scale-95 border-dashed border-indigo-400' : ''} 
                ${isDragOver ? 'ring-4 ring-indigo-500 scale-105 z-10' : ''}
            `}
        >
            <img src={img.imageUrl} alt="Sản phẩm" className={`w-full h-full object-cover transition-transform duration-500 ${img.isPreview ? 'opacity-90' : 'group-hover:scale-105'}`} />

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
                        onClick={() => img.isPreview ? onRemovePreview(img.id) : onRemoveSaved(img.id)}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white/70 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <IoTrashOutline className="text-lg" />
                    </button>
                </div>
            </div>

            {img.isPreview ? (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-teal-500 text-white text-[10px] font-bold shadow-sm animate-pulse">CHƯA LƯU</div>
            ) : (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 text-xs font-extrabold text-slate-800 shadow group-hover:opacity-0 transition-opacity">
                    {img.sortOrder}
                </div>
            )}
        </div>
    );
}

export default ProductImageManagerDialog;