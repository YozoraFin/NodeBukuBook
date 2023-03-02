import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { convertToHTML } from 'draft-convert';
import { useNavigate, useParams } from 'react-router-dom'

export default function EditBuku() {const [arrFile, setArrFile] = useState([])
    const [judul, setJudul] = useState('')
    const [penulis, setPenulis] = useState('')
    const [harga, setHarga] = useState(0)
    const [stok, setStok] = useState(0)
    const [sampul, setSampul] = useState([])
    const [fileStatus, setFileStatus] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState({
        value: 0,
        label: 'Genre'
    })
    const [genre, setGenre] = useState([])
    const [loadingGenre, setLoadingGenre] = useState(true)
    const [sinopsis, setSinopsis] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('<p></p>')
        )
    ))
    const param = useParams()

    const getGenre = () => {
        axios.get('http://localhost:5000/genre').then((res) => {
            setGenre(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingGenre(false)
        })
    }

    const getDetail = () => {
        axios.get('http://localhost:5000/buku/'+param.id).then((res) => {
            setJudul(res.data.data?.Judul)
            setPenulis(res.data.data?.Penulis)
            setHarga(res.data.data?.Harga)
            setStok(res.data.data?.Stok)
            setSelectedGenre({
                value: res.data.data?.Genre.id,
                label: res.data.data?.Genre.Genre
            })
            setSinopsis(EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(res.data.data?.Sinopsis)
                )
            ))
        })
    }

    const getSampul = () => {
        axios.get('http://localhost:5000/sampul/'+param.id).then((res) => {
            var object = []

            for (let index = 0; index < res.data.data?.length; index++) {
                const element = res.data.data[index];
                object.push({
                    id: element?.id,
                    link: element?.SrcGambar,
                    name: element?.NamaGambar,
                    file: ''
                })
            }
            setArrFile(object)
        })
    }

    useEffect(() => {
        getSampul()
    }, [])

    const handleSelectGenre = (e) => {
        setSelectedGenre({
            value: e.value,
            label: e.label
        })
    }

    useEffect(() => {
        getGenre()
        getDetail()
    }, [])

    const handleFileChange = (e) => {
        var arrayfile = []
        for (let index = 0; index < arrFile.length; index++) {
            const element = arrFile[index];
            arrayfile.push({
                id: element.id,
                link: element.link,
                name: element.name,
                file: element.file
            })
        }
        for (let index = 0; index < e.target.files.length; index++) {
            const element = e.target.files[index];
            arrayfile.push({
                id: 0,
                link: URL.createObjectURL(element),
                name: element.name,
                file: element
            })
        }
        setArrFile(arrayfile)
    }

    const handleFileDelete = (index, id) => {
        if(id > 0) {
            axios.delete('http://localhost:5000/sampul/'+id)
        }
        console.log(id)
        var arrSplice = arrFile
        arrSplice.splice(index, 1)
        setArrFile(arrSplice)
        setFileStatus(!fileStatus)
    }

    console.log(arrFile)

    const handleSplice = () => {
        var splice = arrFile.map((arr, index) => {
            return(
                <div className="selectedfiles mt-2">
                    <div className="row">
                        <div className="col-3">
                            <img src={arr.link} alt="" width={60} height={80} />
                        </div>
                        <div className="col-9 d-flex align-items-center mt-2">
                            <p>{arr.name}</p>
                            <p className='ml-auto'><i onClick={() => {handleFileDelete(index, arr.id)}} className="fa-solid fa-trash text-danger"></i></p>
                        </div>
                    </div>
                </div>
            )
        })
        return splice
    }

    const opsi = loadingGenre ?
                    [{value: 0, label: 'Loading'}]
                    :
                    genre?.map((gen) => {
                        return{
                            value: gen.ID,
                            label: gen.Genre
                        }
                    })

    const sFiles = handleSplice()

    useEffect(() => {
        handleSplice()
    }, [fileStatus])

    const handleSubmit = (e) => {
        e.preventDefault()
        const MySwal = withReactContent(Swal)
        if(sinopsis.getCurrentContent().hasText() && sinopsis.getCurrentContent().getPlainText().length > 0) {
            var convert = convertToHTML(sinopsis.getCurrentContent())
            var formData = new FormData(e.target)
            formData.append('Genreid', selectedGenre.value)
            formData.append('Sinopsis', convert)
            formData.append('genrehid', selectedGenre.value)
            if(arrFile.length > 0) {
                for (let index = 0; index < arrFile.length; index++) {
                    const element = arrFile[index];
                    if(element.id === 0) {
                        formData.append('sampul', element.file, element.name)
                        formData.append('NamaGambar', element.name)
                    }
                }
            }
            axios.patch('http://localhost:5000/buku/'+param.id, formData).then((res) => {
                if(res.data.status === 200) {
                    MySwal.fire({
                        title: 'Buku berhasil diperbarui',
                        icon: 'success'
                    })
                } else {
                    MySwal.fire({
                        title: 'Buku gagal diperbarui',
                        text: 'Sepertinya server sedang mengalami gangguan, cobalah untuk menambahkannya lagi nanti',
                        icon: 'warning'
                    })
                }
            })
        } else {
            MySwal.fire({
                title: 'Sinopsis tidak boleh kosong',
                icon: 'warning'
            })
        }
    }

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Edit Buku</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="JudulBuku">Judul</label>
                                                <input value={judul} onChange={(e) => {setJudul(e.target.value)}} required type="text" className="form-control" id="JudulBuku" name='Judul' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="PenulisBuku">Penulis</label>
                                                <input value={penulis} onChange={(e) => {setPenulis(e.target.value)}} required type="text" className="form-control" id="PenulisBuku" name='Penulis' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="HargaBuku">Harga</label>
                                                <input value={harga} onChange={(e) => {setHarga(e.target.value)}} required type="text" className="form-control" id="HargaBuku" name='Harga' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="StokBuku">Stok</label>
                                                <input value={stok} onChange={(e) => {setStok(e.target.value)}} required type="text" className="form-control" id="StokBuku" name='Stok' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="GenreBuku">Genre</label>
                                                <Select
                                                    defaultValue={{ value: 0, label: 'Genre' }}
                                                    options={opsi}
                                                    onChange={handleSelectGenre}
                                                    value={selectedGenre}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group border-bottom pb-2">
                                                <label htmlFor="SampulBuku">Sampul</label>
                                                <div className="input-group">
                                                    <div className="custom-file">
                                                        <input type="file" className="custom-file-input" id='sampulinputcreate' multiple onChange={handleFileChange} />
                                                        <label htmlFor="sampulinputcreate" className='custom-file-label'>Tambahkan</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="selectedfileswrapper">
                                                {sFiles}
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="SinopsisBuku">Sinopsis</label>
                                                <Editor
                                                    editorClassName='form-control'
                                                    editorStyle={{ height: '400px' }}
                                                    editorState={sinopsis}
                                                    onEditorStateChange={setSinopsis}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer"><button className="btn btn-primary float-right">Tambahkan</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
