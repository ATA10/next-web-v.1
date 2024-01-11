import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Modal, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Ekle from './EkleUrun';


// Ana bileşenimiz, ürün listesini görüntüleyen ve düzenlemeyi sağlayan bir form
export default function ProductctForm({ProductList, setProductList, AddProduct}) {
  
  // State değişkenleri: Seçili ürün, düzenlenmiş başlık ve açıklama
  const [selectedProduct, setselectedProduct] = useState(null);
  const [editedTitleProduct, seteditedTitleProduct] = useState('');
  const [editedDescriptionProduct, seteditedDescriptionProduct] = useState('');

  // Fonksiyon: Kart tıklandığında çalışır, seçili ürünü ve bilgilerini set eder
  const handleCardClick = (Product) => {
    setselectedProduct(Product);
    seteditedTitleProduct(Product.title);
    seteditedDescriptionProduct(Product.description);
  };

  // Fonksiyon: Modal'ı kapatır ve state'leri sıfırlar
  const handleCloseModal = () => {
    setselectedProduct(null);
    seteditedTitleProduct('');
    seteditedDescriptionProduct('');
  };

  // Fonksiyon: Güncelle butonuna tıklandığında çalışır, ürünü günceller ve modal'ı kapatır
  const handleUpdate = async () => {
    // Güncellenen veriyi oluştur
    const updatedProduct = {
      ...selectedProduct,
      title: editedTitleProduct,
      description: editedDescriptionProduct,
    };

    // Güncellenen ürünü yerel state içinde bul
    const updatedProductList = ProductList.map((Product) =>
      Product === selectedProduct ? updatedProduct : Product
    );

    // TODO: Yerel state'i güncelle
    setProductList(updatedProductList);

    try {
      // API'ye POST isteği gönderme
      const response = await fetch('/api/ServerProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductList),
      });

      if (response.ok) {
        console.log('Ürün başarıyla güncellendi');
      } else {
        console.error('Ürün güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('API isteği sırasında bir hata oluştu', error);
    }

    // Modal'ı kapat
    handleCloseModal();
  };

  // Fonksiyon: Sil butonuna tıklandığında çalışır, seçili ürünü siler ve modal'ı kapatır
  const handleDelete = async (silinecek) => {
    // Silinen ürünü yerel state içinden filtrele
    const updatedProductList = ProductList.filter((Product) => Product.id !== silinecek);

    // TODO: Yerel state'i güncelle
    setProductList(updatedProductList);
    try {
      // API'ye POST isteği gönderme
      const response = await fetch('/api/ServerProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductList),
      });

      if (response.ok) {
        console.log('Ürün başarıyla güncellendi');
      } else {
        console.error('Ürün güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('API isteği sırasında bir hata oluştu', error);
    }
  };

  // Ana bileşenin render fonksiyonu
  return (
    <>
      <Box sx={{ height: '5vh' }} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="80%" // Tam genişlik
        margin="auto" // Ortala
      >
      <Box display="flex" >
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
          ÜRÜNLERİMİZ
        </Typography>    
        <Ekle AddProduct={AddProduct} ProductList={ProductList}/>
      </Box>
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 4, sm: 4, md: 24 }}
        justifyContent="center"
        alignItems="center"        
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>id</StyledTableCell>
                <StyledTableCell>Fotoğraf</StyledTableCell>
                <StyledTableCell align="center">Başlık</StyledTableCell>
                <StyledTableCell align='center'>Açıklama</StyledTableCell>
                <StyledTableCell align="center">Fiyat</StyledTableCell>
                <StyledTableCell align="center">Güncelle</StyledTableCell>
                <StyledTableCell align="center">sil</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ProductList.map((Product) => (
                <StyledTableRow key={Product.id}>
                  <StyledTableCell >{Product.id}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                  <img src={Product?.img} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </StyledTableCell>
                  <StyledTableCell align="center">{Product.title}</StyledTableCell>
                  <StyledTableCell align="center">{Product.description}</StyledTableCell>
                  <StyledTableCell align="center">{Product.price}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Fab color="inherit" aria-label="edit" onClick={() => handleCardClick(Product)}>
                      <EditIcon />
                    </Fab>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton aria-label="delete" size="large" onClick={() => handleDelete(Product.id)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Modal
        open={Boolean(selectedProduct)}
        onClose={handleCloseModal}
        aria-labelledby="Product-modal"
        aria-describedby="Product-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ overflow: 'auto', backgroundColor: 'rgba(255, 255, 255)', padding: '20px' }}>
        <div style={{ overflow: 'auto', padding: '20px', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom style={{ opacity: '1.0', marginRight: '90px' }}>
            {selectedProduct?.title}   # {selectedProduct?.id}
          </Typography>                
          <IconButton aria-label="upload" size="large" onClick={handleUpdate} >
            <UploadIcon fontSize="large" htmlColor='#0066ff'/>
          </IconButton>
          </div>
          <img src={selectedProduct?.img} alt={selectedProduct?.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
          <TextField
            label="Başlık"
            variant="outlined"
            fullWidth
            value={editedTitleProduct}
            onChange={(e) => seteditedTitleProduct(e.target.value)}
          />
          <TextField
            label="Açıklama"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={editedDescriptionProduct}
            onChange={(e) => seteditedDescriptionProduct(e.target.value)}
          /> 
        </div>
      </Modal>   
      </Box>
    </>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));