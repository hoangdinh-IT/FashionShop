import { MapPin } from 'lucide-react';
import AddressString from '../../addresses/components/AddressString';
import type { Address } from '../../addresses/types/address';

interface Props {
    address?: Address;
    onOpenAddressDialog: () => void;
    note: string;
    onChangeNote: (value: string) => void;
}

const CheckoutAddress = ({ address, onOpenAddressDialog, note, onChangeNote }: Props) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <MapPin size={18} />
                    <span>Giao tới địa chỉ</span>
                </div>
                <button 
                    onClick={onOpenAddressDialog}
                    className="px-5 py-2.5 text-zinc-600 text-xs font-bold border-2 border-zinc-100 hover:border-zinc-900 hover:text-zinc-900 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                    Thay đổi
                </button>
            </div>
            
            {address ? (
                <div className="space-y-1">
                    <p className="font-bold text-lg text-zinc-900">
                        {address.fullName} • {address.phoneNumber}
                    </p>
                    <p className="text-zinc-600 leading-relaxed">
                        <AddressString 
                            addressDetail={address.addressDetail}
                            communeCode={address.commune}
                            districtCode={address.district}
                            cityCode={address.city}
                        />
                    </p>
                </div>
            ) : (
                <p className="text-zinc-400 italic">Chưa có địa chỉ giao hàng</p>
            )}

            <div className="mt-6">
                <input
                    type="text"
                    onChange={(e) => onChangeNote(e.target.value)}
                    placeholder="Ghi chú thêm cho shipper (ví dụ: Giao giờ hành chính)"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all text-zinc-600"
                />
            </div>
        </div>
    );
};

export default CheckoutAddress;