import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { municipalitiesByDistrict, type District } from "@/const/location.const";


interface DistrictSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
}

export const DistrictSelect = ({
    value,
    onValueChange,
    label = "District",
    placeholder = "Select District",
    className,
    error
}: DistrictSelectProps) => {
    return (
        <div className={className}>
            {label && <Label className="mb-2 block text-sm font-medium">{label}</Label>}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={error ? "border-red-500" : ""}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(municipalitiesByDistrict).map((district) => (
                        <SelectItem key={district} value={district}>
                            {district}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

interface MunicipalitySelectProps {
    district: string;
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
}

export const MunicipalitySelect = ({
    district,
    value,
    onValueChange,
    label = "Municipality",
    placeholder = "Select Municipality",
    className,
    error,
    disabled
}: MunicipalitySelectProps) => {
    const municipalities = district && district in municipalitiesByDistrict
        ? municipalitiesByDistrict[district as District]
        : [];

    return (
        <div className={className}>
            {label && <Label className="mb-2 block text-sm font-medium">{label}</Label>}
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled || !district || municipalities.length === 0}
            >
                <SelectTrigger className={error ? "border-red-500" : ""}>
                    <SelectValue placeholder={!district ? "Select District First" : placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {municipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                            {municipality}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};
