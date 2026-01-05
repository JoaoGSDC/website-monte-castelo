import { GiPistolGun, GiPoliceOfficerHead } from 'react-icons/gi';
import { PiCertificateFill, PiSecurityCameraFill } from 'react-icons/pi';
import { FaHouseUser, FaTruck } from 'react-icons/fa6';
import { AiFillAlert, AiFillThunderbolt } from 'react-icons/ai';
import { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  'thunderbolt': <AiFillThunderbolt />,
  'certificate': <PiCertificateFill />,
  'pistol': <GiPistolGun />,
  'house-user': <FaHouseUser />,
  'police-officer': <GiPoliceOfficerHead />,
  'security-camera': <PiSecurityCameraFill />,
  'alert': <AiFillAlert />,
  'truck': <FaTruck />,
};

export function getCourseIcon(iconName?: string): ReactNode {
  if (!iconName) {
    return <PiCertificateFill />; // ícone padrão
  }
  return iconMap[iconName] || <PiCertificateFill />;
}
