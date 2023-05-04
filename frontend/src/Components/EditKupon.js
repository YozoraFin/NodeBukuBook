import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Editor } from 'react-draft-wysiwyg'

export default function EditKupon() {
    const [tipe, setTipe] = useState(2)
    const [potongan, setPotongan] = useState(0)
    const [bannerName, setBannerName] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    const [judul, setJudul] = useState('')
    const [teaser, setTeaser] = useState('')
    const [highlight, setHighlight] = useState(false)
    const [kode, setKode] = useState('')
    const [akses, setAkses] = useState(false)
    const [range, setRange] = useState([new Date(), new Date()])
    const [minimal, setMinimal] = useState(0)
    const [deskripsi, setDeskripsi] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
            convertFromHTML('<p></p>')
        )
    ))
    const [customer, setCustomer] = useState([])
    const [loadingCustomer, setLoadingCustomer] = useState(true)
    const [selectedCustomer, setSelectedCustomer] = useState([])
    const [batasPakai, setBatasPakai] = useState(0)

    const param = useParams()

    const navigate = useNavigate()

    const handleCustomer = (e) => {
        var cus = selectedCustomer
        if(!cus.some(c => c.id === e.value.id) && e.value.id !== 0) {
            setSelectedCustomer(prev => [...prev, e.value])
        }
        console.log(selectedCustomer)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const MySwal = withReactContent(Swal)
        if(deskripsi.getCurrentContent().hasText() && deskripsi.getCurrentContent().getPlainText().length > 0) {
            let convert = convertToHTML(deskripsi.getCurrentContent())
            var formData = new FormData(e.target)
            formData.append('NamaGambar', bannerName)
            formData.append('Mulai', new Date(range[0]).getTime())
            formData.append('Selesai', new Date(range[1]).getTime())
            formData.append('Deskripsi', convert)
            formData.append('Customer', selectedCustomer.map((cus) => cus?.id))
            axios.patch('http://localhost:5000/kupon/'+param.id, formData).then((res) => {
                if(res.data.status === 200) {
                    MySwal.fire({
                        title: 'Berhasil memperbarui kupon',
                        icon: 'success'
                    }).then(() => {
                        navigate('/admin/kupon')
                    })
                } else {
                    MySwal.fire({
                        title: 'Kode kupon ini sudah digunakan',
                        text: 'Cobalah gunakan kode lain',
                        icon: 'error'
                    })
                }
            })
        } else {
            MySwal.fire({
                title: 'Deskripsi tidak boleh kosong',
                icon: 'error'
            })
        }
    }

    const handleBannerChange = (e) => {
        setBannerName(e.target.files[0].name)
        setBannerUrl(URL.createObjectURL(e.target.files[0]))
    }

    const handleChangeMinimal = (e) => {
        if(e.target.value < 0) {
            setMinimal(0)
        } else {
            setMinimal(e.target.value)
        }
    }

    const handleChangeBatasPakai = (e) => {
        if(e.target.value < 0) {
            setBatasPakai(0)
        } else {
            setBatasPakai(e.target.value)
        }
    }

    const handleChangePotongan = (e) => {
        if(e.target.value < 0) {
            setPotongan(0)
        } else {
            if(tipe && tipe !== 2) {
                if(e.target.value > 100) {
                    setPotongan(100)
                } else {
                    setPotongan(e.target.value)
                }
            } else {
                setPotongan(e.target.value)
            }
        }
    }

    const handleChangeAkses = (e) => {
        setAkses(Number(e.target.value))
        if(e.target.value) {
            setHighlight(false)
        }
    } 
    
    const handleChangeTipe = (e) => {
        setTipe(Number(e.target.value))
        if(Number(e.target.value)) {
            if(potongan > 100) {
                setPotongan(100)
            }
        } 
    }

    const handleChangeJudul = (e) => {
        setJudul(e.target.value)
    }

    const handleChangeKode = (e) => {
        setKode(e.target.value)
    }

    const handleChangeTeaser = (e) => {
        setTeaser(e.target.value)
    }

    const getCustomer = () => {
        axios.post('http://localhost:5000/customer/getall', {Pass: process.env.REACT_APP_SECRET_ADMIN}).then((res) => {
            setCustomer(res.data.data)
            setLoadingCustomer(false)
        })
    }

    const getDetail = () => {
        axios.post(`http://localhost:5000/kupon/admin/${param.id}`, {Pass: process.env.REACT_APP_SECRET_ADMIN}).then((res) => {
            console.log(res.data)
            setHighlight(res.data?.data?.HighLight)
            setJudul(res.data?.data?.Judul)
            setKode(res.data?.data?.Kode)
            setBannerName(res.data?.data?.NamaGambar)
            setPotongan(res.data?.data?.Potongan)
            setBannerUrl(res.data?.data?.SrcGambar)
            setTeaser(res.data?.data?.Teaser)
            setTipe(res.data?.data?.Tipe)
            setAkses(res.data?.data?.Akses)
            setDeskripsi(EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(res.data?.data?.Deskripsi)
                )
            ))
            setSelectedCustomer(res.data?.data?.Customer)
            // Nambahin initial Range
            setRange([new Date(res.data?.data?.Mulai), new Date(res?.data?.data?.Selesai)])
            setMinimal(res.data?.data?.Minimal)
        })
    }

    useEffect(() => {
        getDetail()
        getCustomer()
    }, [])

    const columnCustomer = [
        {
            name: 'Nama',
            cell: cus => cus?.NamaLengkap
        },
        {
            name: 'Email',
            cell: cus => cus?.Email
        },
        {
            name: 'Opsi',
            cell: (cus) => <div className="text-center"><button onClick={() => {setSelectedCustomer(selectedCustomer.filter((cust) => cust !== cus))}} className="btn btn-danger ml-2"><i className="fa-solid fa-x"></i></button></div>,
            width: '180px'
        }
    ]
    
    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }

    const options = loadingCustomer
                    ? [{value: {id: 0}, label: 'Loading...'}]
                    : customer?.map((cus) => {
                        return {
                            value: cus,
                            label: cus?.Email
                        }
                    })
    
    const emptyMessage = (
        <span>
            Tolong pilih customer!
        </span>
    );
    

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-md-12">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Edit Kupon</h3>
                            </div>
                            <form onSubmit={handleSubmit} >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label onChange={handleChangeJudul} htmlFor="Judul">Judul</label>
                                                <input value={judul} required className='form-control' type="text" placeholder='Judul' id='Judul' name='Judul' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Kode">Kode</label>
                                                <input onChange={handleChangeKode} value={kode} required className='form-control' type="text" placeholder='Kode' id='Kode' name='Kode' />
                                            </div>
                                            <div className="form-group">
                                                <div className="form-check">
                                                    <input onClick={() => {akses ? setHighlight(false) : setHighlight(!highlight)}} checked={highlight} className='form-check-input' type="checkbox" placeholder='Highlight' id='Highlight' name='HighLight' />
                                                    <label htmlFor="Hightlight" className='form-check-label'>Hightlight Kupon</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Tipe</label>
                                                <div className="form-check">
                                                    <input checked={!tipe} required id='Rupiah' onClick={handleChangeTipe} type="radio" className="form-check-input" name='Tipe' value={0} />
                                                    <label htmlFor="Rupiah" className="form-check-label">Rupiah (Rp)</label>
                                                </div>
                                                <div className="form-check">
                                                    <input checked={tipe} required id='Persen' onClick={handleChangeTipe} type="radio" className="form-check-input" name='Tipe' value={1} />
                                                    <label htmlFor="Persen" className="form-check-label">Persen (%)</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Potongan">Potongan</label>
                                                <div className="input-group">
                                                    <div className='input-group-prepend'>
                                                        <div className="input-group-text">{!tipe ? 'Rp' : '%'}</div>
                                                    </div>
                                                    <input required onChange={handleChangePotongan} value={potongan === 0 ? '' : potongan} className='form-control col-6' type="number" placeholder='Potongan' id='Potongan' name='Potongan' />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Potongan">Minimal</label>
                                                <div className="input-group">
                                                    <div className='input-group-prepend'>
                                                        <div className="input-group-text">Rp</div>
                                                    </div>
                                                    <input onChange={handleChangeMinimal} value={minimal === 0 ? '' : minimal} className='form-control col-6' type="number" placeholder='Minimal' id='Potongan' name='Minimal' />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Potongan">Batas Pemakaian (Per Akun)</label>
                                                <div className="input-group">
                                                    <div className='input-group-prepend'>
                                                        <i className="fa-regular fa-circle-user input-group-text"></i>
                                                    </div>
                                                    <input onChange={handleChangeBatasPakai} value={batasPakai === 0 ? '' : batasPakai} className='form-control col-6' type="number" placeholder='Batas Pakai' id='Potongan' name='BatasPakai' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="Banner">Banner</label>
                                                <div className="custom-file">
                                                    <input onChange={handleBannerChange} type="file" className='custom-file-input' id='Banner' name='SrcGambar' />
                                                    <label htmlFor="Banner" className="custom-file-label">{bannerName === '' ? 'Pilih Banner' : 'Ganti Banner'}</label>
                                                </div>
                                            </div>
                                            {bannerName !== '' ?
                                            <div className="form-group">
                                                <label>{bannerName}</label>
                                                <img className='banner-kupon' src={bannerUrl} alt="" />
                                            </div>
                                            : ''}
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="Teaser">Teaser</label>
                                                <input onChange={handleChangeTeaser} value={teaser} required className='form-control' type="text" placeholder='Teaser' id='Teaser' name='Teaser' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Deskripsi">Deskripsi</label>
                                                <Editor
                                                    editorClassName='form-control'
                                                    editorState={deskripsi}
                                                    onEditorStateChange={setDeskripsi}
                                                    editorStyle={{ height: '250px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group col-4 p-0">
                                                <label htmlFor="Durasi">Durasi</label>
                                                <div className="input-group">
                                                    <DateTimeRangePicker className='form-control' value={range} onChange={setRange} calendarIcon={null} clearIcon={null} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Akses</label>
                                                <div className="form-check">
                                                    <input checked={!akses} required id='Global' onChange={() => {}} onClick={handleChangeAkses} type="radio" className="form-check-input" name='Akses' value={0} />
                                                    <label htmlFor="Global" className="form-check-label">Global</label>
                                                </div>
                                                <div className="form-check">
                                                    <input checked={akses} required id='Pribadi' onChange={() => {}} onClick={handleChangeAkses} type="radio" className="form-check-input" name='Akses' value={1} />
                                                    <label htmlFor="Pribadi" className="form-check-label">Pribadi</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {akses 
                                        ? 
                                        <div>
                                            <Select
                                                options={options}
                                                isSearchable
                                                onChange={handleCustomer}
                                                className='col-4 p-0'
                                                value={{ value: null, label: 'Customer' }}
                                            />
                                            <DataTable
                                                pagination
                                                data={selectedCustomer}
                                                progressPending={loadingCustomer}
                                                customStyles={customStyle}
                                                columns={columnCustomer}
                                                noDataComponent={emptyMessage}
                                            />
                                        </div>
                                        : ''
                                    }
                                </div>
                                <div className="card-footer">
                                    <button type='submit' className="btn btn-primary float-right">Perbarui</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
