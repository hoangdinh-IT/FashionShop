import { MapPin } from 'lucide-react';
import AddressString from '../../../addresses/components/AddressString';
import type { Address } from '../../../addresses/types/address';

interface Props {
    address?: Address;
    onOpenAddressDialog: () => void;
    note: string;
    onChangeNote: (value: string) => void;
}

const CheckoutAddress = ({ address, onOpenAddressDialog, note, onChangeNote }: Props) => {
    // CheckoutAddress.tsx

return (
    <div className="rounded-[30px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-100">
            
            <div className="flex items-start gap-4">
                
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
                        Shipping Address
                    </p>

                    <h2 className="mt-1 text-[20px] font-bold tracking-tight text-zinc-900">
                        Địa chỉ giao hàng
                    </h2>
                </div>
            </div>

            <button 
                onClick={onOpenAddressDialog}
                className="h-11 px-5 rounded-2xl border border-zinc-200 bg-white text-[12px] font-semibold text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all cursor-pointer"
            >
                Thay đổi
            </button>
        </div>

        {/* ADDRESS */}
        <div className="pt-6">
            
            {address ? (
                <div className="rounded-[24px] border border-zinc-100 bg-[#fafafa] p-5">
                    
                    <div className="flex items-center gap-3 flex-wrap">
                        
                        <h3 className="text-[17px] font-bold tracking-tight text-zinc-900">
                            {address.fullName}
                        </h3>

                        <div className="w-1 h-1 rounded-full bg-zinc-300" />

                        <span className="text-sm font-medium text-zinc-500">
                            {address.phoneNumber}
                        </span>
                    </div>

                    <p className="mt-4 text-[15px] leading-7 text-zinc-600">
                        <AddressString 
                            addressDetail={address.addressDetail}
                            communeCode={address.commune}
                            districtCode={address.district}
                            cityCode={address.city}
                        />
                    </p>
                </div>
            ) : (
                <div className="rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-400 italic">
                    Chưa có địa chỉ giao hàng
                </div>
            )}

            {/* NOTE */}
            <div className="mt-6">
                
                <div className="mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                        Delivery Note
                    </span>
                </div>

                <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => onChangeNote(e.target.value)}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    className="
                        w-full resize-none rounded-[24px]
                        border border-zinc-200
                        bg-[#fafafa]
                        px-5 py-4
                        text-[14px] text-zinc-700
                        placeholder:text-zinc-400
                        focus:outline-none
                        focus:border-zinc-900
                        transition-all
                    "
                />
            </div>
        </div>
    </div>
);
};

export default CheckoutAddress;