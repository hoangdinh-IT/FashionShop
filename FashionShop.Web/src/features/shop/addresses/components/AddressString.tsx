import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    addressDetail: string;
    communeCode: string | number;
    districtCode: string | number;
    cityCode: string | number;
}

const AddressString: React.FC<Props> = ({ addressDetail, communeCode, districtCode, cityCode }) => {
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
            {addressDetail}{locationName ? `, ${locationName}` : ""}
        </span>
    );
};

export default AddressString;