import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToHTML } from 'draft-convert';

export default function EditArtikel() {
    const [judul, setJudul] = useState('')
    const [penulis, setPenulis] = useState('')
    const [teaser, setTeaser] = useState('')
    const [isi, setIsi] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('<p></p>')
        )
    ))
    const [kategori, setKategori] = useState([])
    const [sKategori, setsKategori] = useState(0)
    const [loadingKategori, setLoadingKategori] = useState(true)
    const [FileName, setFileName] = useState('')
    const [FileUrl, setFileUrl] = useState('')
    const navigate = useNavigate()
    const param = useParams()
    const valueSelect = useRef({value: 0, label: 'Kategori'})

    const getKategori = () => {
        axios.get('http://localhost:5000/kategori').then((res) => {
            setKategori(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingKategori(false)
        })
    }

    const getDetail = () => {
        axios.get('http://localhost:5000/artikel/'+param.id).then((res) => {
            setJudul(res.data.data?.Judul)
            setPenulis(res.data.data?.Penulis)
            setTeaser(res.data.data?.Teaser)
            setIsi(EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(res.data.data?.Isi)
                )
            ))
            setFileName(res.data.data?.NamaGambar)
            setFileUrl(res.data.data?.SrcGambar)
            valueSelect.current = {value: res.data.data?.KategoriID, label: res.data.data?.Kategori}
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const MySwal = withReactContent(Swal)
        if(isi.getCurrentContent().hasText() && isi.getCurrentContent().getPlainText().length > 0){
            let convert = convertToHTML(isi.getCurrentContent())
            var formData = new FormData(e.target)
            formData.append('Isi', convert)
            formData.append('NamaGambar', FileName)
            formData.append('KategoriID', sKategori)
            axios.patch('http://localhost:5000/artikel/'+param.id, formData).then((res) => {
                if(res.data.status === 200) {
                    MySwal.fire({
                        title: 'Berhasil memperbarui artikel',
                        icon: 'success'
                    }).then(() => {
                        navigate('/admin/artikel')
                    })
                } else {
                    MySwal.fire({
                        title: 'Gagal memperbarui',
                        text: 'Sepertinya server sedang mengalami masalah, cobalah untuk memperbaruinya lain kali',
                        icon: 'error'
                    })
                }
            })
        } else {
            MySwal.fire({
                title: 'Isi tidak boleh kosong',
                icon: 'warning'
            })
        }
        
    }

    const handleFileChange = (e) => {
        setFileName(e.target.files[0].name)
        setFileUrl(URL.createObjectURL(e.target.files[0]))
    }

    const handleKategori = (e) => {
        setsKategori(e.value)
        valueSelect.current = {value: e.value, label: e.label}
    }

    useEffect(() => {
        getKategori()
        getDetail()
    }, [])

    const options = loadingKategori ? 

                    [{value: 0, label: 'Loading...'}]

                    :

                    kategori?.map((kat) => {
                        return{
                            value: kat?.id,
                            label: kat?.Kategori
                        }
                    })

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Buat Artikel</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="judulartikel">Judul</label>
                                                <input value={judul} onChange={(e) => {setJudul(e.target.value)}} required type="text" id="judulartikel" className="form-control" name='Judul' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="penulisartikel">Penulis</label>
                                                <input value={penulis} onChange={(e) => {setPenulis(e.target.value)}} required type="text" id="penulisartikel" className="form-control" name='Penulis' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="judulartikel">Cover</label>
                                                <div className="input-group">
                                                    <div className="custom-file">
                                                        <input onChange={handleFileChange} type="file" id="coverartikel" className="custom-file-input" name='cover' />
                                                        <label htmlFor="coverartikel" className="custom-file-label">{FileName === '' ? 'Pilih File' : FileName}</label>
                                                    </div>
                                                </div>
                                                {FileName === '' ? '' : <img src={FileUrl} width={300} height={200} className='mt-3' alt='selectedcover'/>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Teaser">Teaser</label>
                                                <textarea value={teaser} onChange={(e) => {setTeaser(e.target.value)}} required className='form-control' name="Teaser" id="Teaser" cols="30" rows="10"></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="judulartikel">Kategori</label>
                                                <Select
                                                    value={valueSelect.current}
                                                    defaultValue={{value: 0, label: 'Kategori'}}
                                                    options={options}
                                                    onChange={handleKategori}
                                                    isSearchable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <div className="form-group">
                                                <label htmlFor="isiartikel">Isi</label>
                                                <Editor
                                                    editorClassName='form-control'
                                                    editorState={isi}
                                                    onEditorStateChange={setIsi}
                                                    editorStyle={{ height: '800px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right">Tambahkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
