import React from 'react';
import type { Address } from '../types/address';
import AddressString from './AddressString';

interface Props {
    data: Address[];
    isLoading: boolean;
    onCreate: () => void;
    onEdit: (address: Address) => void;
    onSetDefaultAddress: (addressId: string) => void;
    onDelete: (addressId: string) => void
}

const AccountAddress: React.FC<Props> = ({
    data,
    isLoading,
    onCreate,
    onEdit,
    onSetDefaultAddress,
    onDelete,
}) => {
    
    return (
        <main className="flex-1 bg-white rounded-[2rem] shadow-sm border border-zinc-100 p-8 md:p-12 min-h-[600px]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] text-zinc-900 uppercase mb-2">
                        Địa chỉ của tôi
                    </h1>
                </div>
                <button 
                    onClick={onCreate}
                    className="group flex items-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 transition-all duration-300"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    THÊM ĐỊA CHỈ
                </button>
            </div>

            {/* Danh sách địa chỉ */}
            <div className="grid grid-cols-1 gap-6">
    {/* Trạng thái Loading (Tùy chọn hiển thị) */}
    {isLoading && <div className="text-zinc-500 text-sm flex items-center justify-center py-10">Đang tải dữ liệu...</div>}

    {/* Render danh sách từ mảng */}
    {!isLoading && data.map((item) => (
        <div key={item.id} className={`group relative border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${item.isDefault ? 'border-zinc-400 bg-zinc-50/30' : 'border-zinc-200 hover:border-zinc-300'}`}>
            
            {/* Nhóm Nút Hành Động (Góc phải) */}
            <div className="absolute top-5 right-5 flex items-center gap-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {item.isDefault ? (
                    // Chỉ có nút Cập nhật nếu là Mặc định
                    <button 
                        onClick={() => onEdit(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border border-transparent text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-200 hover:text-black transition-all shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Cập nhật
                    </button>
                ) : (
                    // Các nút cho địa chỉ KHÔNG Mặc định
                    <>
                        <button 
                            onClick={() => onSetDefaultAddress(item.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Đặt mặc định
                        </button>
                        
                        <button 
                            onClick={() => onEdit(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-600 rounded-full hover:bg-zinc-200 hover:text-zinc-900 transition-all duration-300 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Cập nhật
                        </button>
                        
                        <button 
                            onClick={() => onDelete(item.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-sm font-medium text-red-500 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-300 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                        </button>
                    </>
                )}
            </div>

            {/* Thông tin người nhận */}
            <div className="flex items-center gap-3 mb-4 pr-[320px]"> {/* Tăng padding right để không đè lên nút */}
                <h3 className="text-lg font-bold text-zinc-900">{item.fullName}</h3>
                
                {/* Hiển thị Badge Mặc định nếu isDefault = true */}
                {item.isDefault && (
                    <span className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        Mặc định
                    </span>
                )}
            </div>
            
            {/* Chi tiết liên hệ & Địa chỉ */}
            <div className="space-y-3 text-[15px] text-zinc-600">
                <p className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </span>
                    <span className="font-medium text-zinc-700">{item.phoneNumber}</span>
                </p>
                <p className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </span>
                    {/* Dùng whitespace-pre-line để tự động xuống dòng */}
                    <span className="leading-relaxed whitespace-pre-line mt-1">
                        <AddressString 
                            addressDetail={item.addressDetail} 
                            communeCode={item.commune} 
                            districtCode={item.district} 
                            cityCode={item.city} 
                        />
                    </span>
                </p>
            </div>
        </div>
    ))}
    
    {/* Trạng thái trống (Optional) */}
    {!isLoading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <svg className="w-12 h-12 text-zinc-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-zinc-500 font-medium">Bạn chưa có địa chỉ nào.</p>
            <p className="text-zinc-400 text-sm mt-1">Hãy thêm địa chỉ mới để bắt đầu mua sắm nhé!</p>
        </div>
    )}
</div>
            
        </main>
    );
};

export default AccountAddress;