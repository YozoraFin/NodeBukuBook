import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EditSocial() {
    const [namaSocial, setNamaSocial] = useState('')
    const [iconSocial, setIconSocial] = useState('')
    const [linkSocial, setLinkSocial] = useState('')
    const params = useParams()

    const getDetail = () => {
        axios.get('http://localhost:5000/social/'+params.id).then((res) => {
            setNamaSocial(res?.data?.data?.Nama)
            setIconSocial(res?.data?.data?.Icon)
            setLinkSocial(res?.data?.data?.Link)
        })
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        var object = {
            Nama: namaSocial,
            Link: linkSocial,
            Icon: iconSocial
        }
        axios.patch(`http://localhost:5000/social/${params.id}`, object).then(() => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: 'Berhasil diperbarui',
                icon: 'success'
            })
        })
    }

    useEffect(() => {
        getDetail()
    }, [])

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 pl-3">
                    <div className="col-md-4">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Edit {namaSocial} <span className='ml-3' dangerouslySetInnerHTML={{ __html: iconSocial }}></span></h3>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="Nama">Nama</label>
                                        <input onChange={(e) => {setNamaSocial(e.target.value)}} value={namaSocial} type="text" className='form-control' id='Nama'/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Icon">Icon (<a className='text-info' target={'__blank'} href="https://fontawesome.com">fontawesome.com</a>)</label>
                                        <input onChange={(e) => {setIconSocial(e.target.value)}} value={iconSocial} type="text" className="form-control" id='Icon'/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Link">Link</label>
                                        <input onChange={(e) => {setLinkSocial(e.target.value)}} value={linkSocial} type="text" className="form-control" id='Link' />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
