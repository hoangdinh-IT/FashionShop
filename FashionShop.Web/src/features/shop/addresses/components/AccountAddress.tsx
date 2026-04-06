import React, { useEffect, useState } from 'react';
import type { Address } from '../types/address';
import axios from 'axios';

interface Props {
    data: Address[];
    isLoading: boolean;
    onCreate: () => void;
    onEdit: (address: Address) => void;
    onDelete: (addressId: string) => void
}

const AccountAddress: React.FC<Props> = ({
    data,
    isLoading,
    onCreate,
    onEdit,
    onDelete
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
                {isLoading && <div className="text-zinc-500 text-sm">Đang tải dữ liệu...</div>}

                {/* Render danh sách từ mảng */}
                {!isLoading && data.map((item) => (
                    <div key={item.id} className={`group relative border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${item.isDefault ? 'border-zinc-400' : 'border-zinc-200 hover:border-zinc-900'}`}>
                        
                        {/* Nhóm Nút Hành Động (Góc phải) */}
                        <div className="absolute top-6 right-6 flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                            {item.isDefault ? (
                                // Chỉ có nút Cập nhật nếu là Mặc định
                                <button 
                                    onClick={() => onEdit(item)}
                                    className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline transition-all"
                                >
                                    Cập nhật
                                </button>
                            ) : (
                                // Các nút cho địa chỉ KHÔNG Mặc định
                                <>
                                    <button 
                                        onClick={() => onEdit(item)}
                                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline transition-all"
                                    >
                                        Cập nhật
                                    </button>
                                    <span className="w-px h-3 bg-zinc-300"></span>
                                    <button 
                                        onClick={() => onDelete(item.id)}
                                        className="text-sm font-medium text-zinc-500 hover:text-red-600 underline-offset-4 hover:underline transition-all"
                                    >
                                        Xóa
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thông tin người nhận */}
                        <div className="flex items-center gap-3 mb-4 pr-32">
                            <h3 className="text-lg font-semibold text-zinc-900">{item.fullName}</h3>
                            
                            {/* Hiển thị Badge Mặc định nếu isDefault = true */}
                            {item.isDefault && (
                                <span className="flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                                    Mặc định
                                </span>
                            )}
                        </div>
                        
                        {/* Chi tiết liên hệ & Địa chỉ */}
                        <div className="space-y-2.5 text-[15px] text-zinc-600">
                            <p className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {item.phoneNumber}
                            </p>
                            <p className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-zinc-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {/* Dùng whitespace-pre-line để tự động xuống dòng nếu API trả về chuỗi có ký tự \n */}
                                <span className="leading-relaxed whitespace-pre-line">
                                    <AddressString 
                                        detail={item.addressDetail} 
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
                    <div className="text-center py-10 text-zinc-500">
                        Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới nhé!
                    </div>
                )}
            </div>

            
        </main>
    );
};

interface AddressStringProps {
    detail: string;
    communeCode: string | number;
    districtCode: string | number;
    cityCode: string | number;
}

const AddressString: React.FC<AddressStringProps> = ({ detail, communeCode, districtCode, cityCode }) => {
    const [locationName, setLocationName] = useState<string>("Đang tải dữ liệu...");

    useEffect(() => {
        // Nếu không có đủ mã thì không gọi API
        if (!cityCode || !districtCode || !communeCode) {
            setLocationName("");
            return;
        }

        // Gọi API song song để lấy Tên từ 3 Mã
        Promise.all([
            axios.get(`https://provinces.open-api.vn/api/w/${communeCode}`),
            axios.get(`https://provinces.open-api.vn/api/d/${districtCode}`),
            axios.get(`https://provinces.open-api.vn/api/p/${cityCode}`)
        ])
        .then(([wardRes, districtRes, cityRes]) => {
            // Nối chuỗi tên lại với nhau
            setLocationName(`${wardRes.data.name}, ${districtRes.data.name}, ${cityRes.data.name}`);
        })
        .catch(err => {
            console.error("Lỗi dịch địa chỉ:", err);
            setLocationName("Lỗi hiển thị khu vực");
        });
    }, [communeCode, districtCode, cityCode]);

    return (
        <span className="leading-relaxed whitespace-pre-line">
            {detail}{locationName ? `, ${locationName}` : ""}
        </span>
    );
};

export default AccountAddress;