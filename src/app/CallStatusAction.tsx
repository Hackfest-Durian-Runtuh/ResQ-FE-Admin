import { CallStatus } from "@/constant/call_status"
import { Button } from "@mui/material"

type CallStatusActionProps = {
    call_status_id: string,
    em_transport_id: string,
    onProsesPanggilanClick: () => void,
    onKirimPetugasClick: () => void,
    onLihatPetugasClick: () => void,
    onLihatPemohonClick: () => void
}


export const CallStatusAction: React.FC<CallStatusActionProps> = ({
    call_status_id = "",
    em_transport_id = "",
    onProsesPanggilanClick = () => { },
    onKirimPetugasClick = () => { },
    onLihatPetugasClick = () => { },
    onLihatPemohonClick = () => { }
}) => {

    switch (call_status_id) {
        case CallStatus.MENUNGGU_KONFIRMASI:
            return <div className="flex space-x-[8px]">
                <Button variant="contained" className="w-[256px] bg-lime-600" onClick={onLihatPemohonClick}>Lihat Pemohon</Button>
                <Button variant="contained" className="w-[256px] bg-blue-600" onClick={onProsesPanggilanClick}>Proses Panggilan</Button>
            </div>
        case CallStatus.DIPROSES: {
            if (em_transport_id == ".") {
                return <Button variant="contained" className="w-[512px] bg-yellow-600" onClick={onKirimPetugasClick}>Kirim Petugas</Button>
            } else {
                return <Button variant="contained" className="w-[512px] bg-lime-600" onClick={onLihatPetugasClick}>Lihat Petugas</Button>
            }
        }

        case CallStatus.SEDANG_PERJALANAN:
            return <div></div>
        case CallStatus.SELESAI:
            return <div></div>
        case CallStatus.DIBATALKAN:
            return <div></div>
        default:
            return <div></div>
    }
}