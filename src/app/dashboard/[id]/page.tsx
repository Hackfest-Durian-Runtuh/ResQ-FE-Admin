"use client"

import { CallStatus } from "@/constant/call_status"
import { EmCallStatus, EmCallStruct, EmProviderStruct, EmTransportStruct, EmTypeStruct, Repository, UserStruct } from "@/data/repository"
import { Box, Button, Icon, Modal } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { Loading, Notify } from "notiflix"
import React from "react"
import { Component, ReactNode, useEffect, useState } from "react"
import { CallStatusAction } from "@/app/CallStatusAction"

export default function DashboardScreen() {
    const params = useParams()
    const id = params.id.toString()
    const repository = new Repository()
    const router = useRouter()
    const [datas, setDatas] = useState<EmCallStruct[]>([])
    const [emPvd, setEmPvd] = useState<EmProviderStruct>({
        em_pvd_id: "",
        em_type: "",
        name: ""
    })
    const [emType, setEmType] = useState<EmTypeStruct>({
        em_type_id: "",
        word: ""
    })
    const [emCallStatus, _] = useState(new Map<string, string>())
    const [pickedEmCall, setPickedEmCall] = useState<EmCallStruct | null>(null)
    const [showLihatPemohonModal, setShowLihatPemohonModal] = useState(false)
    const [showKirimPetugasModal, setShowKirimPetugasModal] = useState(false)
    const [showLihatPetugasModal, setShowLihatPetugasModal] = useState(false)
    const [emTransport, setEmTransport] = useState<EmTransportStruct[]>([])
    const [singleTransport, setSingleTransport] = useState<EmTransportStruct | null>(null)
    const [singleUserStruct, setSingleUserStruct] = useState<UserStruct | null>(null)
    const [newCall, setNewCall] = useState<EmCallStruct | null>(null)

    useEffect(() => {
        repository.listenEmergencyCall(
            id,
            (snapshot) => {
                setDatas(
                    Object
                        .values<EmCallStruct>(snapshot.val())
                        .map((value) => {
                            return value
                        })
                        .sort((a, b) => {
                            return b.created_at - a.created_at
                        })
                )
            },
            (newChild) => {
                if (newChild.size > 0) {
                    // setNewCall(
                    //     Object.values<EmCallStruct>(newChild.exportVal()).sort((a, b) => {
                    //         return b.created_at - a.created_at
                    //     })[0]
                    // )

                    // Object.values<EmCallStruct>(newChild.exportVal()).forEach(s => {
                    //     console.log(s.uid)
                    // })
                }
            }
        )

        repository.getEmProviderById(
            id,
            (s) => {
                setEmPvd(s)
            }
        )

        repository.getAllCallStatus(
            (s) => {
                s.forEach(item => {
                    emCallStatus.set(
                        item.em_call_status_id,
                        item.word
                    )
                })
            }
        )
    }, [])

    useEffect(() => {
        repository.getEmTrasportById(
            id,
            (datas) => {
                setEmTransport(datas)
            },
        )
    }, [showKirimPetugasModal])

    useEffect(() => {
        if (emPvd.em_pvd_id != "") {
            repository.getEmType(
                emPvd.em_type,
                (s) => {
                    setEmType(s)
                }
            )
        }
    }, [emPvd])

    useEffect(() => {
        if (pickedEmCall != null) {
            repository.getSingleEmTransport(
                pickedEmCall.em_transport_id,
                s => {
                    setSingleTransport(s)
                }
            )
        }
    }, [showLihatPetugasModal])

    useEffect(() => {
        if (pickedEmCall != null) {
            repository.getSingleUser(
                pickedEmCall.uid,
                s => {
                    setSingleUserStruct(s)
                }
            )
        }
    }, [showLihatPemohonModal])

    return (
        <div>
            <div className="h-screen bg-slate-200">
                <div className="flex justify-end items-center w-full h-[150px] bg-slate-300">
                    <div className="flex flex-col px-[32px] items-end">
                        <p className="text-[32px]">{emPvd.name}</p>
                        <p>Kategori : {emType.word}</p>
                        <Button variant="contained" className="bg-red-600 mt-[8px]" onClick={() => {
                            router.push('/login')
                        }}>Keluar</Button>
                    </div>
                </div>
                <div className="mx-[32px] my-[32px]">
                    {/* <div className="h-[256px] rounded-xl border-[2px] border-gray-300 p-[32px]">
                        {<Notification call={newCall} />}
                    </div> */}
                    <table className="w-full border border-slate-700 mt-[32px]">
                        <thead>
                            <tr>
                                <th className="border border-slate-700">No</th>
                                <th className="border border-slate-700">Id Panggilan</th>
                                <th className="border border-slate-700">Waktu Panggilan</th>
                                <th className="border border-slate-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((item, index) => {
                                return (
                                    <tr key={item.em_call_id}>
                                        <td className="text-center border border-slate-700 p-[16px]">{index + 1}</td>
                                        <td className="border border-slate-700 p-[16px]">{item.em_call_id}</td>
                                        <td className="border border-slate-700 p-[16px]">{new Date(item.created_at).toString()}</td>
                                        <td className="text-center border border-slate-700 p-[16px]">
                                            <div className="flex flex-col items-center space-y-[16px]">
                                                <p>{emCallStatus.get(item.em_call_status_id) ?? "..."}</p>
                                                <CallStatusAction
                                                    call_status_id={item.em_call_status_id}
                                                    em_transport_id={item.em_transport_id}
                                                    onProsesPanggilanClick={() => {
                                                        Loading.circle()
                                                        repository.changeCallStatus(
                                                            item.em_call_id,
                                                            CallStatus.DIPROSES,
                                                            () => {
                                                                Loading.remove()
                                                                repository.sendNotificationToUser(
                                                                    item.uid,
                                                                    "Panggilan Ditindak lanjuti",
                                                                    "Panggilan sedang diproses, tunggu tindakan selanjutnya!",
                                                                    () => {
                                                                        //TODO
                                                                    }
                                                                )
                                                                Notify.success(`Status Panggilan ${item.em_call_id} Berhasil Dirubah`)
                                                            }
                                                        )
                                                    }}
                                                    onKirimPetugasClick={() => {
                                                        setShowKirimPetugasModal(true)
                                                        setPickedEmCall(item)
                                                    }}
                                                    onLihatPetugasClick={() => {
                                                        setShowLihatPetugasModal(true)
                                                        setPickedEmCall(item)
                                                    }}
                                                    onLihatPemohonClick={() => {
                                                        setShowLihatPemohonModal(true)
                                                        setPickedEmCall(item)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={showKirimPetugasModal}
                onClose={() => {
                    setShowKirimPetugasModal(false)
                    setPickedEmCall(null)
                }}
                className="flex justify-center items-center"
            >
                <Box>
                    <div className="p-[32px] overflow-auto flex flex-col items-center justify-center bg-white rounded-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th className="px-[16px] py-[8px] border border-black">No</th>
                                    <th className="px-[16px] py-[8px] border border-black">Nama Sopir</th>
                                    <th className="px-[16px] py-[8px] border border-black">Id Kendaraan</th>
                                    <th className="px-[16px] py-[8px] border border-black">Plat Kendaraan</th>
                                    <th className="px-[16px] py-[8px] border border-black">Status</th>
                                    <th className="px-[16px] py-[8px] border border-black">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    emTransport.map((s, index) => {
                                        return (
                                            <tr key={s.em_transport_id}>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{index + 1}</td>
                                                <td className="px-[16px] py-[8px] border border-black">{s.name}</td>
                                                <td className="px-[16px] py-[8px] border border-black">{s.em_transport_id}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{s.regist_number}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">{(s.is_available) ? "Tersedia" : "Sedang Melayani Panggilan Lain"}</td>
                                                <td className="px-[16px] py-[8px] border border-black text-center">
                                                    {
                                                        (s.is_available) ?
                                                            <Button
                                                                variant="contained"
                                                                className="bg-blue-500"
                                                                onClick={() => {
                                                                    repository.changeCallEmTransportId(
                                                                        pickedEmCall?.em_call_id ?? "",
                                                                        s.em_transport_id,
                                                                        () => {
                                                                            repository.changeEmTransportAvailability(
                                                                                s.em_transport_id,
                                                                                false,
                                                                                () => {
                                                                                    repository.sendNotificationToDriver(
                                                                                        s.em_transport_id,
                                                                                        pickedEmCall?.em_call_id ?? "",
                                                                                        "Panggilan Darurat",
                                                                                        "Panggilan Darurat pada lokasi yang sudah ditentukan",
                                                                                        () => {
                                                                                            setShowKirimPetugasModal(false)
                                                                                            Notify.success("Sudah ditugaskan kepada kendaraan " + s.regist_number)
                                                                                        }
                                                                                    )
                                                                                }
                                                                            )
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                Tugaskan
                                                            </Button>
                                                            : "-"
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={showLihatPetugasModal && singleTransport != null}
                onClose={() => {
                    setShowLihatPetugasModal(false)
                    setPickedEmCall(null)
                    setSingleTransport(null)
                }}
                className="flex justify-center items-center"
            >
                <Box>
                    <div className="p-[32px] space-y-[16px] overflow-auto flex flex-col items-center justify-center bg-white rounded-sm">
                        <p className="text-[20px] font-bold">Detail Petugas</p>
                        <div>
                            <p>Nama: {singleTransport?.name}</p>
                            <p>Nomor Plat: {singleTransport?.regist_number}</p>
                            <p>ID: {singleTransport?.em_pvd_id}</p>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={showLihatPemohonModal && singleUserStruct != null}
                onClose={() => {
                    setShowLihatPemohonModal(false)
                    setPickedEmCall(null)
                    setSingleUserStruct(null)
                }}
                className="flex justify-center items-center"
            >
                <Box>
                    <div className="p-[32px] space-y-[16px] overflow-auto flex flex-col bg-white rounded-sm">
                        <p className="text-[20px] font-bold">Titik Lokasi Kejadian</p>
                        <iframe
                            width="800"
                            height="350"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${pickedEmCall?.user_long}%2C${pickedEmCall?.user_lat}%2C${pickedEmCall?.user_long}%2C${pickedEmCall?.user_lat}`}
                            loading="lazy"
                        ></iframe>
                        <p className="text-[20px] font-bold">Detail Pemohon</p>
                        <div className="flex space-x-[48px]">
                            <div>
                                <p className="text-[16px] font-bold">Informasi Dasar</p>
                                <p>Nama Lengkap: {singleUserStruct?.fullname}</p>
                                <p>Golongan Darah: {singleUserStruct?.golongan_darah}</p>
                                <p>Umur: -</p>
                                <p>Berat Badan: {singleUserStruct?.berat_badan} kg</p>
                                <p>Tinggi Badan: {singleUserStruct?.tinggi_badan} cm</p>
                                <p>NIK: {singleUserStruct?.nik}</p>
                                <p>Tempat Lahir: {singleUserStruct?.tempat_lahir}</p>
                                <p>Tanggal Lahir: {singleUserStruct?.tanggal_lahir}</p>
                            </div>

                            <div className="flex flex-col space-y-[24px]">
                                <div>
                                    <p className="text-[16px] font-bold">Asuransi</p>
                                    <p>Nama Asuransi: {singleUserStruct?.asuransi}</p>
                                    <p>Nomor Asuransi: {singleUserStruct?.nomor_asuransi}</p>
                                </div>
                                <div>
                                    <p className="text-[16px] font-bold">Riwayat Penyakit</p>

                                    {singleUserStruct?.penyakit?.map((s) => {
                                        return (
                                            <div className="mb-[16px]">
                                                <p>Nama Penyakit: {s.nama_penyakit}</p>
                                                <p>Tahun Terkena Penyakit: {s.tahun_penyakit}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <Button variant="contained" className=" bg-yellow-600" onClick={() => {
                            Loading.circle()
                            repository.changeCallStatus(
                                pickedEmCall?.em_call_id ?? "",
                                CallStatus.DIPROSES,
                                () => {
                                    Loading.remove()

                                    //TODO This is not gonna works, because now uid and biodata_id is different. But there is still a lot of stuff that make it like same

                                    // repository.sendNotificationToUser(
                                    //     pickedEmCall?.uid ?? "",
                                    //     "Panggilan Ditindak lanjuti",
                                    //     "Panggilan sedang diproses, tunggu tindakan selanjutnya!",
                                    //     () => {
                                    //         //TODO
                                    //     }
                                    // )

                                    setShowLihatPemohonModal(false)
                                    Notify.success(`Status Panggilan ${pickedEmCall?.em_call_id} Berhasil Dirubah`)
                                }
                            )
                        }}>Proses Panggilan</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
