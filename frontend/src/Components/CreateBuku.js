import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { convertToHTML } from 'draft-convert';

export default function CreateBuku() {
    const [arrFile, setArrFile] = useState([])
    const [fileStatus, setFileStatus] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState([])
    const [genre, setGenre] = useState([])
    const [loadingGenre, setLoadingGenre] = useState(true)
    const [sinopsis, setSinopsis] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('<p></p>')
        )
    ))

    const getGenre = () => {
        axios.get('http://localhost:5000/genre').then((res) => {
            setGenre(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingGenre(false)
        })
    }

    const handleSelectGenre = (e) => {
        setSelectedGenre(e.value)
    }

    useEffect(() => {
        getGenre()
    }, [])

    const handleFileChange = (e) => {
        var arrayfile = []
        for (let index = 0; index < e.target.files.length; index++) {
            const element = e.target.files[index];
            arrayfile.push({
                file: element,
                name: element.name,
                link: URL.createObjectURL(element)
            })
        }
        setArrFile(arrayfile)
    }

    const handleFileDelete = (id) => {
        var arrSplice = arrFile
        arrSplice.splice(id, 1)
        setArrFile(arrSplice)
        setFileStatus(!fileStatus)
    }

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
                            <p className='ml-auto'><i onClick={() => {handleFileDelete(index)}} className="fa-solid fa-trash text-danger"></i></p>
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
            formData.append('Genreid', selectedGenre)
            formData.append('Sinopsis', convert)
            if(arrFile.length > 0) {
                var file = []
                var name = []
                for (let index = 0; index < arrFile.length; index++) {
                    const element = arrFile[index];
                    console.log(element)
                    formData.append('sampul', element.file, name)
                    formData.append('NamaGambar', element.name)
                    file.push(element.file)
                    name.push(element.name)
                }
            }
            axios.post('http://localhost:5000/buku', formData).then((res) => {
                if(res.data.status === 200) {
                    MySwal.fire({
                        title: 'Buku berhasil ditambahkan',
                        icon: 'success'
                    })
                } else {
                    MySwal.fire({
                        title: 'Buku gagal ditambahkan',
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
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Create Buku</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="JudulBuku">Judul</label>
                                                <input required type="text" className="form-control" id="JudulBuku" name='Judul' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="PenulisBuku">Penulis</label>
                                                <input required type="text" className="form-control" id="PenulisBuku" name='Penulis' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="HargaBuku">Harga</label>
                                                <input required type="text" className="form-control" id="HargaBuku" name='Harga' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="StokBuku">Stok</label>
                                                <input required type="text" className="form-control" id="StokBuku" name='Stok' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="GenreBuku">Genre</label>
                                                <Select
                                                    defaultValue={{ value: 0, label: 'Genre' }}
                                                    options={opsi}
                                                    onChange={handleSelectGenre}
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
