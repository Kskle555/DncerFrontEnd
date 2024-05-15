import React, { useEffect,useState } from 'react';
import DataGrid, {
  Column, Editing, Popup, Paging, Lookup, Form,
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';

import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'devextreme/dist/css/dx.light.css'; // Stil dosyasını projeye ekleyin
import $ from 'jquery';

import { Button } from 'devextreme-react';
export default function App() {

  const notesEditorOptions = { height: 100 };


  const [data, setData] = useState([]);
  const [CarPartsData, setCarPartsData] = useState(null);
  const [showVehicleList, setShowVehicleList] = useState(true);
  const [showVehicleParts, setShowVehicleParts] = useState(false);
  const [VehiclePartsCarName, setVehiclePartsCarName] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clickedRowId, setClickedRowId] = useState(null);
  const [modalData, setModalData] = useState(null);
const [modalCarPartsData, setModalCarPartsData] = useState(null);
  
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      height: '60%'
    },
  };



  useEffect(() => {
    // Component monte edildiğinde Ajax istekleri gönderme
    try {
      // İlk istek (https://localhost:7068/api/Car)
      $.ajax({
        url: 'https://localhost:7068/api/Car',
        method: 'GET',
        success: function(carResponse) {
          setData(carResponse);
          $.ajax({
            url: 'https://localhost:7068/api/CarParts',
            method: 'GET',
            success: function(carPartsResponse) {
              // CarParts API'den gelen verileri al ve her birine AracMarka özelliği ekle
              const carPartsWithAracMarka = carPartsResponse.map(part => ({
                ...part,
                VehicleBrand: carResponse.find(car => car.id === part.carId)?.carName || 'Bilinmeyen Marka'
              }));

              // Yeni verileri state'e kaydetme
              setCarPartsData(carPartsWithAracMarka);

              if (carResponse.length === 0) {
                toast.error('Car data is empty!');
              }
              if (carPartsResponse.length === 0) {
                toast.error('CarParts data is empty!');
              }

              if (carResponse.length > 0) {
                toast.success('Car data fetched successfully!');
              }
            },
            error: function(xhr, status, error) {
              console.error('Error fetching CarParts data:', error);
            }
          });
        },
        error: function(xhr, status, error) {
          console.error('Error fetching Car data:', error);
        }
      });
    } catch (error) {
      console.error('Ajax request error:', error);
    }
  }, []);






const handleShowVehicleList = () => {
  setShowVehicleList(showVehicleList => !showVehicleList);

}

const handleShowVehicleParts = () => {
  setShowVehicleParts(showVehicleParts => !showVehicleParts);
}

if(showVehicleParts == false && showVehicleList == false){

 toast.error('Please select atleast one module to show data');
}





const handleFormChanged = (e) => {
  console.log(e.data);

  $.ajax({
    url: 'https://localhost:7068/api/Car?id=' + e.data.id,
    method: 'PUT',
    contentType: 'application/json', // JSON verisi 
    data: JSON.stringify(e.data), // Veriyi JSON formatına dönüştür
    success: function(response) {
      toast.success('Car data updated successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error updating Car data:', error);
    }
  });
}


const handleFormRemoved = (e) => {
  console.log(e.data);

  $.ajax({
    url: 'https://localhost:7068/api/Car?id=' + e.data.id,
    method: 'DELETE',
    success: function(response) {
      toast.success('Car data deleted successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error deleting Car data:', error);
    }
  });
}

const handleFormAdded = (e) => {


  e.data.id=0;
  toast.info('Adding Car data...');


// Gönderilecek verileri JSON formatına dönüştürerek gönder
$.ajax({
    url: 'https://localhost:7068/api/Car',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(e.data),
    success: function(response) {
        toast.success('Car data added successfully!');
    },
    error: function(xhr, status, error) {
        console.error('Error adding Car data:', error);
    }
});

}


const handleFormChangedCarParts = (e) => {


e.data.carId =0;
  $.ajax({
    url: 'https://localhost:7068/api/Car?id=' + e.data.id,
    method: 'PUT',
    contentType: 'application/json', // JSON verisi 
    data: JSON.stringify(e.data), // Veriyi JSON formatına dönüştür
    success: function(response) {
      toast.success('Car data updated successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error updating Car data:', error);
    }
  });
}

const handleFormAddedCarParts = (e) => {
 e.data.id=0;
  $.ajax({
    url: 'https://localhost:7068/api/CarParts',
    method: 'POST',
    contentType: 'application/json', // JSON verisi 
    data: JSON.stringify(e.data), // Veriyi JSON formatına dönüştür
    success: function(response) {
      toast.success('CarParts data updated successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error updating CarParts data:', error);
    }
  });
}


const handleFormDeleteCarParts = (e) => {
  console.log( "test" +e.data);

  $.ajax({
    url: 'https://localhost:7068/api/CarParts/' + e.data.id,
    method: 'DELETE',
    success: function(response) {
      toast.success('CarParts data deleted successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error deleting CarParts data:', error);
    }
  });
}


const handleFormVehiclePartsChanged = (e) => {
  console.log(e.data);
  $.ajax({
    url: 'https://localhost:7068/api/CarParts?id=' + e.data.id,
    method: 'PUT',
    contentType: 'application/json', // JSON verisi 
    data: JSON.stringify(e.data), // Veriyi JSON formatına dönüştür
    success: function(response) {
      toast.success('CarParts data updated successfully!');
    },
    error: function(xhr, status, error) {
      console.error('Error updating CarParts data:', error);
    }
  });
}

// Modalı açan fonksiyon
function openModal(id) {
  setIsOpen(true);
  setClickedRowId(id);
  setModalData(data.find(car => car.id === id));
  setModalCarPartsData(CarPartsData.find(part => part.id === id));
}

function afterOpenModal() {
  // references are now sync'd and can be accessed.
  console.log('Modal is open');
}

function closeModal() {
  setIsOpen(false);
  setModalData(null);
  setModalCarPartsData(null);

}
  return (
    
    <div>
      <h1 className='text-center mt-3 text-blue-600 text-2xl'>Araç Takip</h1>
      <div className='flex flex-wrap justify-center mt-5 gap-10'>
      <Button
      type="normal"
      text="Show Vehicle List"
      icon="car" // İstediğiniz ikonun adını girin
      style={{ backgroundColor: '#4CAF50' }} // Yeşil renk kodu
      onClick={handleShowVehicleList}
    />

<Button
      type="normal"
      text="Show Vehicle Parts"
      icon="preferences" // İstediğiniz ikonun adını girin
      style={{ backgroundColor: '#4CAF50' }} // Yeşil renk kodu
      onClick={handleShowVehicleParts}
    />
      </div>
      <ToastContainer position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light" />
     {showVehicleList?   <div id="data-grid-demo">
     <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Car Modal"
      >


<div className="fixed inset-0 flex items-center justify-center text-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center max-w-md w-full">
            <div className="bg-gray-800 px-4 py-3 flex justify-between text-center items-center">
              <h2 className="text-white text-lg font-semibold text-center">Car Details</h2>
              <button className="text-white" onClick={closeModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700">Car Name: {modalData?.carName}</p>
              <p className="text-gray-700">Brand: {modalData?.brand}</p>
              <p className="text-gray-700">Model: {modalData?.model}</p>
              <p className="text-gray-700">Year: {modalData?.carYear}</p>
              <p className="text-gray-700">Color: {modalData?.color}</p>
            </div>
            <div className="bg-gray-800 px-4 py-3 flex justify-between text-center items-center">
              <h2 className="text-white text-lg font-semibold text-center">Car Parts Details</h2>
              <button className="text-white" onClick={closeModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700">Part Name: {modalCarPartsData?.partName}</p>
              <p className="text-gray-700">Description: {modalCarPartsData?.description}</p>
              <p className="text-gray-700">Vehicle Brand: {modalCarPartsData?.VehicleBrand}</p>
              <p className="text-gray-700">Price: {modalCarPartsData?.price}</p>
              <p className="text-gray-700">Currency: {modalCarPartsData?.currency}</p>
            </div>
          </div>
        </div>
     
    
        {/* <Button
      type="normal"
      text="Close"
      icon="remove" // İstediğiniz ikonun adını girin
      style={{ backgroundColor: '#4CAF50' }} onClick={closeModal}></Button> */}
        
        
      </Modal>
    <DataGrid
      dataSource={data}
      onRowUpdated={handleFormChanged}
      onRowRemoved={handleFormRemoved}
      onRowInserted={handleFormAdded}
      keyExpr="id"
      showBorders={true}
    >
      <Paging enabled={false} />
      <Editing
        mode="popup"
        allowUpdating={true}
        allowAdding={true}
        allowDeleting={true}
      
      >
        <Popup
          title="Car Info"
          showTitle={true}
          width={700}
          height={525}
        />
        <Form>
          <Item
            itemType="group"
            colCount={2}
            colSpan={2}
          >
          
            <Item dataField="carName" isRequired={true} />
            <Item dataField="brand" isRequired={true} />
            <Item dataField="model"  isRequired={true}/>
            <Item dataField="carYear"  isRequired={true}/>
            <Item dataField="color" isRequired={true}/>
            <Item dataField="engineType" isRequired={true} />
          
          </Item>

        
        </Form>
      </Editing>
      <Column dataField="id" caption='CarId' isRequired={true} />
      <Column dataField="carName" dataType='string' />
      <Column dataField="brand" dataType='string' />
      <Column dataField="model" dataType='string' />
      <Column dataField="carYear" dataType='number' />
      <Column dataField="color" dataType='string' />
      <Column dataField="engineType" dataType='string' />
      
      <Column
          caption="Details"
          width={100}
          cellRender={(data) => (
            <Button
              text="Details"
              onClick={() => openModal(data.data.id)} // openModal fonksiyonunu onClick olayına bağlayın
            />
          )}
        />
     
      
    </DataGrid>
  </div>
  
  :null}



{showVehicleParts? <DataGrid
      dataSource={CarPartsData}
      keyExpr="id"
    onRowRemoved={handleFormDeleteCarParts}
    onRowInserted={handleFormAddedCarParts}
    onRowUpdated={handleFormVehiclePartsChanged}
      showBorders={true}
    >
      <Paging enabled={false} />
      <Editing
        mode="popup"
        allowUpdating={true}
        allowAdding={true}
        allowDeleting={true}
      >
        <Popup
          title="Car Parts Info"
          showTitle={true}
          width={700}
          height={525}
        />
        <Form>
          <Item
            itemType="group"
            colCount={2}
            colSpan={2}
          >
            <Item dataField="partName" isRequired={true} />
            <Item dataField="description" isRequired={true} />
            <Item dataField="brand" isRequired={true}/>
            <Item dataField="model" isRequired={true} />
            <Item dataField="price" isRequired={true} />
            <Item dataField="currency" isRequired={true}  />
            <Item dataField='carId' isRequired={true} />
          </Item>

        
        </Form>
      </Editing>
      
      <Column dataField="partName" dataType='string' />
      <Column dataField="description" dataType='string'  />
      <Column dataField="brand" dataType='string' />
      <Column dataField="model" dataType='string' />
      <Column dataField="price" dataType='number' />
      <Column dataField="currency" dataType='string' />
      <Column dataField="VehicleBrand" dataType='number' />
      <Column dataField="carId" dataType='number' visible={false} />
    </DataGrid> :null}


    </div>
  )
}
