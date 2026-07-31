import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
    addressDetail?: string;
    communeCode?: string | number;
    districtCode?: string | number;
    cityCode?: string | number;
    className?: string; // Cho phép truyền class CSS tùy chỉnh từ bên ngoài
}

const AddressString: React.FC<Props> = ({
    addressDetail,
    communeCode,
    districtCode,
    cityCode,
    className = ""
}) => {
    const [locationName, setLocationName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!cityCode || !districtCode || !communeCode) {
            setLocationName("");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.all([
            axios.get(`https://provinces.open-api.vn/api/w/${communeCode}`),
            axios.get(`https://provinces.open-api.vn/api/d/${districtCode}`),
            axios.get(`https://provinces.open-api.vn/api/p/${cityCode}`)
        ])
            .then(([wardRes, districtRes, cityRes]) => {
                setLocationName(
                    `${wardRes.data.name}, ${districtRes.data.name}, ${cityRes.data.name}`
                );
            })
            .catch((err) => {
                console.error("Lỗi dịch địa chỉ:", err);
                setLocationName("Lỗi hiển thị khu vực");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [communeCode, districtCode, cityCode]);

    // Skeleton thu nhỏ gọn chuẩn với text-[10px]
    if (isLoading) {
        return (
            <span className={`inline-flex items-center gap-1 align-middle max-w-full ${className}`}>
                <span className="h-2.5 w-16 animate-pulse rounded bg-zinc-200 shrink-0" />
                <span className="h-2.5 w-24 animate-pulse rounded bg-zinc-100" />
            </span>
        );
    }

    if (!locationName) return null;

    const fullAddress = addressDetail?.trim()
        ? `${addressDetail.trim()}, ${locationName}`
        : locationName;

    return (
        <span 
            className={`inline break-words whitespace-normal text-inherit ${className}`}
        >
            {fullAddress}
        </span>
    );
};

export default AddressString;