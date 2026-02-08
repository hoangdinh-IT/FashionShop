import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

// Sử dụng Generic <T> để component này dùng được cho MỌI loại Form
interface RenderToggleProps<T extends FieldValues> {
    label: string;
    subLabel?: string;
    name: Path<T>; // Quan trọng: Đảm bảo 'name' phải là key có thật trong Form
    register: UseFormRegister<T>;
}

const RenderToggle = <T extends FieldValues>({ 
    label, 
    subLabel, 
    name, 
    register 
}: RenderToggleProps<T>) => {
    return (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between transition-colors hover:border-gray-200">
            <div className="flex items-center gap-3">
                
                {/* Labels */}
                <div>
                    <h4 className="text-sm font-bold text-gray-800">{label}</h4>
                    {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
                </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    {...register(name)} 
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    );
};

export default RenderToggle;