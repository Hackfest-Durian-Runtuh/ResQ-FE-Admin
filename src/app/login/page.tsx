"use client"

import { Repository } from "@/data/repository";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const repo = new Repository()
    const router = useRouter()
    const [list, setList] = useState([
        {
            em_pvd_id: "",
            name: ""
        }
    ])
    const [pickedId, setPickedId] = useState("")

    useEffect(() => {
        repo.getAllEmProvider(
            (data) => {
                setList(
                    data.docs.map((s) => {
                        return {
                            em_pvd_id: s.get("em_pvd_id"),
                            name: s.get("name")
                        }
                    })
                )
            },
            (err) => {
                console.log(err)
            }
        )
    },[])

    return (
        <div className="flex">
            <div className="w-1/2 bg-blue-100">
                <div className="flex flex-col justify-center items-center content-center space-y-[64px] px-[62px] py-[72px]">
                    <table className="bg-white overflow-auto h-[512px]">
                        <thead>
                            <tr>
                                <th className="py-[8px] px-[16px] border-black border">No.</th>
                                <th className="py-[8px] px-[16px] border-black border">Emergency Provider Id</th>
                                <th className="py-[8px] px-[16px] border-black border">Nama Emergency Provider</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((s, index) => {
                                return <tr key={index}>
                                    <td className="py-[8px] px-[16px] border-black border">{index + 1}</td>
                                    <td className="py-[8px] px-[16px] border-black border">{s.em_pvd_id}</td>
                                    <td className="py-[8px] px-[16px] border-black border">{s.name}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div>
                        <p className="text-[32px]">Disclaimer</p>
                        <p>Sebagai prototype, anda tidak perlu login sebagai admin. Anda hanya perlu memasukkan ID yang ingin anda gunakan.</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 h-screen space-y-[16px]">
                <div className="flex flex-col items-center">
                    <p className="text-[32px]">
                        Selamat Datang
                    </p>
                    <p>
                        Masuk menggunakan akun Admin anda
                    </p>
                </div>
                <TextField
                    label="EMERGENCY PROVIDER ID"
                    variant="outlined"
                    size="small"
                    className="w-96"
                    onChange={(s) => {
                        setPickedId(s.target.value)
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="bg-blue-500 w-96"
                    disabled={pickedId.length <= 0}
                    onClick={() => {
                        router.push(`dashboard/${pickedId}`)
                    }}
                >
                    Masuk
                </Button>
            </div>
        </div>

    )
}