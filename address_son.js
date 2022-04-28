const UserAddresses = () => {

    const [addresses, setAddresses] = React.useState([]);
    const [provinces, setProvinces] = React.useState([]);
    const [provinceId, setProvinceId] = React.useState(null);
    const [districtId, setDistrictId] = React.useState(null);
    const [neigId, setNeigId] = React.useState(0);
    const baseUrl = BASE_URL_;

//testasdasd
//get user addresses
    const getAddresses = async () => {
        const res_token = await fetch(`${baseUrl}/addresses/new`)
            .then(response => response.json())

        const token = res_token.csrf_kint_token;
        try {
            await fetch(`${baseUrl}/addresses?customer_id=${_user_id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "csrf_kint_token": token,
                })
            }).then(response => response.json())
                .then(data => setAddresses(data))
        } catch (e) {
            console.log(e)
        }


    }
    const province = async () => {
        const response = await fetch('https://mobilservis.kintshop.com/MobileController/province/provinceId')
            .then(response => response.json());
        setProvinces(response);
    }

    React.useEffect(() => {
        getAddresses()
        province()
    }, [])
    const provinceChangeHandler = (e) => {
        setProvinceId(e.target.value)
        setNeigId(null)
        setDistrictId(null)
    }
    const changeDistrictHandler = (e) => {
        setDistrictId(e.target.value)
        setProvinceId(e.target[e.target.selectedIndex].getAttribute('data-province'))
    }


    return (
        <AddressBox
            addresses={addresses}
            provinces={provinces}
            provinceChangeHandler={provinceChangeHandler}
            provinceId={provinceId}
            neigId={neigId}
            changeDistrictHandler={changeDistrictHandler}
            districtId={districtId}

        />
    )

}

const Modal = ({
                   addressId,
                   item,
                   provinces,
                   provinceChangeHandler,
                   provinceId,
                   neigId,
                   changeDistrictHandler,
                   districtId,

               }) => {


    const [kurumsalField, setKurumsalField] = React.useState(false)

    React.useEffect(() => {
        item.fatura_type === 'K' && setKurumsalField(true)

    }, [])

    const kurumsalFieldChangeHandler = (e) => {
        e.target.value === 'K' ? setKurumsalField(true) : setKurumsalField(false)
    }

    return (
        <div className="modal fade" id={`editAddressModal_${addressId}`} tabIndex={-1}
             aria-labelledby="editAddressModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editAddressModalLabel">Adres
                            Düzenle</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <form className="row" method="POST" id={`shipment_form_${item.id}`}
                              action={`${BASE_URL_}/CustomerController/updateAddress`}>
                            <input type="hidden" name="csrf_kint_token" value={CSRF_HASH}/>
                            <input type="hidden" name="id" value={item.id}/>
                            {/*ad-soyad-tel*/}
                            <div className="col-md-6">
                                <label className="form-label">Ad</label>
                                <input type="text" className="form-control form-control-modal"
                                       form={`shipment_form_${item.id}`}
                                       name="contact_name"
                                       defaultValue={item.contact_name} required/>
                                <input type="hidden" name="address_type" defaultValue={2}/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Soyad</label>
                                <input type="text" className="form-control form-control-modal"
                                       form={`shipment_form_${item.id}`}
                                       name="contact_surname"
                                       defaultValue={item.contact_surname} required/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Telefon</label><span
                                style={{fontSize: '12px'}}
                                className="spn-warn"> (05XX XXX XX XX)</span>
                                <input name="contact_phone" id="contact_phone"
                                       form={`shipment_form_${item.id}`}
                                       placeholder="05_ _  _ _ _  _ _  _ _" maxLength={11} minLength={11}
                                       type="phone" className="form-control form-control-modal"
                                       defaultValue={item.contact_phone} required/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>

                            {/*il*/}
                            <Province
                                provinces={provinces}
                                item={item}
                                provinceChangeHandler={provinceChangeHandler}
                            />
                            {/*ilçe*/}
                            <District
                                item={item}
                                provinceId={provinceId}
                                changeDistrictHandler={changeDistrictHandler}
                            />
                            {/*Mahaller*/}
                            <Neig
                                item={item}
                                neigId={neigId}
                                districtId={districtId}
                                provinceId={provinceId}
                            />


                            <div className="col-md-12">
                                <label className="form-label">Tc
                                    Kimlik No:</label>
                                <input type="text"
                                       onKeyPress="return event.charCode >= 48 && event.charCode <= 57"
                                       form={`shipment_form_${item.id}`} maxLength={11}
                                       minLength={10} className="form-control form-control-textarea"
                                       name="tcId"
                                       placeholder="_ _ _ _ _ _ _ _ _ _ _"
                                       defaultValue={item.tcId}
                                       required/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Adres</label>
                                <textarea name="address" form={`shipment_form_${item.id}`}
                                          className="form-control form-control-textarea" required
                                          defaultValue={item.address}/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Adres
                                    Başlığı</label>
                                <input type="text" name="title"
                                       form={`shipment_form_${item.id}`}
                                       className="form-control form-control-modal"
                                       defaultValue={item.title} required/>
                                <div className="invalid-feedback">
                                    Bu alan boş bırakılamaz.
                                </div>
                            </div>
                            <div className="col-md-12">
                                <p>Fatura Türü</p>

                                <div onChange={kurumsalFieldChangeHandler} className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="">
                                            {item.fatura_type === 'B' &&
                                                <input defaultChecked type="radio"
                                                       className="bireysel" name="fatura_type"
                                                       value="B"/> ||
                                                <input type="radio"
                                                       className="bireysel" name="fatura_type"
                                                       value="B"/>
                                            }
                                            Bireysel

                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label>
                                            {item.fatura_type === 'K' &&
                                                <input defaultChecked type="radio"

                                                       className="kurumsal" name="fatura_type"
                                                       value="K"/> ||
                                                <input type="radio"

                                                       className="kurumsal" name="fatura_type"
                                                       value="K"/>
                                            }

                                            Kurumsal
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {kurumsalField &&
                                <KurumsalField
                                    item={item}
                                /> ||
                                null
                            }


                            <div className="col-12 mt-4">
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-modal-close"
                                            data-bs-dismiss="modal">Kapat
                                    </button>
                                    <button type="submit" className="btn btn-modal-ks ">Kaydet</button>
                                </div>
                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

const AddressBox = ({
                        addresses,
                        provinces,
                        provinceChangeHandler,
                        provinceId,
                        neigId,
                        changeDistrictHandler,
                        districtId,
                        kurumsalField
                    }) => {

    return (
        <div className="row">
            {addresses.map(item =>
                <div key={item.id} className="col-12 col-md-6 col-lg-6 col-xl-4 mb-1">
                    <label className="border rounded-3 p-3 w-100 labelCard">
                        <div className="position-relative" style={{minHeight: '155px'}}>
                            <div className="d-flex align-items-center mb-2">
                                <input type="radio" name="teslimat" form="form_address" defaultValue
                                       className="me-2 radio form-check-input"/>
                                <div className="adressHead d-inline">
                                    <div className="adressName d-inline"> {item.title}</div> <br/>
                                    <div className="d-inline contactName">
                                        <span>{item.contact_name} {item.contact_surname}</span>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-2" style={{color: '#212529'}}/>
                            <span className="adressDetail"> {item.address}</span>
                            <div className="pb-1"
                                 style={{position: 'absolute', bottom: 0, width: '100%', height: '25px'}}>
                                <div className="row">
                                    <div className="col-6 adressIcon">
                                        <a className="editAddress1" href="javascript:;" data-bs-toggle="modal"
                                           data-bs-target={`#editAddressModal_${item.id}`}><i
                                            className="far fa-edit"/>
                                            Düzenle</a>
                                    </div>
                                    <div className="col-6 text-end adressIcon">
                                        <a href="javascript:;" data-link-id={item.id}
                                           className="text-decoration-none delete-ask ms-1">
                                            <i className="far fa-trash-alt"/>
                                            Sil
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                    <Modal
                        item={item}
                        addressId={item.id}
                        provinces={provinces}
                        provinceChangeHandler={provinceChangeHandler}
                        provinceId={provinceId}
                        neigId={neigId}
                        changeDistrictHandler={changeDistrictHandler}
                        districtId={districtId}
                        kurumsalField={kurumsalField}
                    />

                </div>
            )}


        </div>
    )
}

const KurumsalField = ({item}) => {
    return (
        <div className="row">
            <div className="col-md-12 mt-3">
                <label className="form-label">Firma Adı</label>
                <input type="text" name="firma_name"
                       form={`shipment_form_${item.id}`}
                       defaultValue={item.firma_name}
                       className="form-control form-control-modal"/>
                <h3 className="invalid-feedback">Bu alan boş bırakılamaz.</h3>
            </div>
            <div className="col-md-6 ">
                <label className="form-label">Vergi Dairesi</label>
                <input type="text" className="form-control form-control-modal"
                       form={`shipment_form_${item.id}`}
                       defaultValue={item.vergi_dairesi}
                       name="vergi_dairesi"/>
                <div className="invalid-feedback">Bu alan boş bırakılamaz.</div>
            </div>


            <div className="col-md-6 ">
                <label className="form-label">Vergi Numarası</label>
                <input type="text" className="form-control form-control-modal"
                       form={`shipment_form_${item.id}`}
                       defaultValue={item.vergi_numarasi}
                       name="vergi_numarasi"/>
                <div className="invalid-feedback">Bu alan boş bırakılamaz.</div>
            </div>

        </div>
    )
}

const Province = ({item, provinces, provinceChangeHandler}) => {

    return (
        <div className="col-md-6">
            <label className="form-label">İl</label>
            <select onChange={provinceChangeHandler} name="province_id"
                    className="form-select province" required>
                {provinces.map(province =>
                    item.province_id === province.id &&
                    <option selected value={province.id} key={province.id}>{province.province_name}</option> ||
                    <option value={province.id} key={province.id}>{province.province_name}</option>
                )}

            </select>
            <div className="invalid-feedback">Bu alan boş bırakılamaz.</div>
        </div>
    )

}

const District = ({item, provinceId, changeDistrictHandler}) => {
    const [district, setDistrict] = React.useState([]);


    const districtFetch = async () => {
        provinceId === null ?
            await fetch(`${BASE_URL_}/addresses/${item.province_id}`)
                .then(response => response.json())
                .then(data => setDistrict(data)) :
            await fetch(`${BASE_URL_}/addresses/${provinceId}`)
                .then(response => response.json())
                .then(data => setDistrict(data))

    }


    React.useEffect(() => {
        districtFetch()
    }, [provinceId])

    return (
        <div className="col-md-6">
            <label className="form-label">İlçe</label>
            <div>
                <select name="district_id" onChange={changeDistrictHandler}
                        className="form-select">
                    {district.map(dis =>
                        dis.id === item.district_id &&
                        <option selected key={dis.id} value={dis.id}>{dis.district_name}</option> ||
                        <option key={dis.id} data-province={dis.province_id}
                                value={dis.id}>{dis.district_name}</option>
                    )}

                </select>
                <div className="invalid-feedback">Bu alan boş bırakılamaz.</div>
            </div>
        </div>
    )
}

const Neig = ({item, neigId, districtId, provinceId}) => {

    const [neig, setNeig] = React.useState([]);
    const neigFetch = async () => {
        neigId !== null ?
            await fetch(`https://mobilservis.kintshop.com/MobileController/neighborhood/${item.province_id}/${item.district_id}`)
                .then(response => response.json())
                .then(data => setNeig(data)) :
            setNeig([{
                "id": 0,
                "neighborhood_name": "Seçiniz"
            }])
    }
    const neigFetch1 = async () => {
        districtId !== null ?
            await fetch(`https://mobilservis.kintshop.com/MobileController/neighborhood/${provinceId}/${districtId}`)
                .then(response => response.json())
                .then(data => setNeig(data)) :
            setNeig([{
                "id": 0,
                "neighborhood_name": "Seçiniz"
            }])
    }

    React.useEffect(() => {
        neigFetch()
        neigFetch1()
    }, [neigId, districtId])

    return (
        <div className="col-md-6">
            <label className="form-label">İlçe</label>
            <div>
                <select name="neighborhood_id"
                        className="form-select">
                    {neig.map(nei =>
                        item.neighborhood_id === nei.id &&
                        <option selected key={nei.id} value={nei.id}> {nei.neighborhood_name}</option> ||
                        <option key={nei.id} value={nei.id}> {nei.neighborhood_name}</option>
                    )}
                </select>
                <div className="invalid-feedback">Bu alan boş bırakılamaz.</div>
            </div>
        </div>
    )
}

const element = document.getElementById('addresses1');
ReactDOM.render(React.createElement(UserAddresses), element)