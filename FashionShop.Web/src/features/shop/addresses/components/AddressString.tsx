import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    addressDetail?: string;
    communeCode?: string | number;
    districtCode?: string | number;
    cityCode?: string | number;
}

const AddressString: React.FC<Props> = ({
    addressDetail,
    communeCode,
    districtCode,
    cityCode
}) => {

    const [locationName, setLocationName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <span className="leading-relaxed whitespace-pre-line">
            {isLoading ? (

                <span className="inline-flex items-center ml-2 gap-2 align-middle">
                    <span className="h-4 w-28 animate-pulse rounded-full bg-zinc-200" />
                    <span className="h-4 w-64 animate-pulse rounded-full bg-zinc-100" />
                </span>

            ) : locationName ? (

                `${addressDetail}, ${locationName}`

            ) : null}
        </span>
    );
};

export default AddressString;