import React from 'react';
import { Box, Typography, ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import Ekle from './GaleriEkle';

interface Galeriss {
  id: number;
  img: string;
  title: string;
}

interface GaleriFormProps {
  GaleriList: Galeriss[]; // Use the actual type for Galeriss
  setGaleriList: React.Dispatch<React.SetStateAction<Galeriss[]>>; // Use the actual type for Galeriss
  AddGaleri: (newGaleri: Galeriss) => void; // Use the actual type for Galeriss
}

const GaleriForm: React.FC<GaleriFormProps> = ({ GaleriList, setGaleriList, AddGaleri }) => {
  // Fonksiyon: Sil butonuna tıklandığında çalışır, seçili ürünü siler ve modal'ı kapatır
  const handleDelete = async (silinecekID: number) => {
    try {
      // Silinen ürünü yerel state içinden filtrele
      const updatedGaleriList = GaleriList.filter((Galeri) => Galeri.id !== silinecekID);

      // TODO: Yerel state'i güncelle
      setGaleriList(updatedGaleriList);

      // API'ye POST isteği gönderme
      const response = await fetch('/api/ServerGaleri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGaleriList),
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

  return (
    <>
      <Box sx={{ height: '5vh' }} id="galeri" />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="80%" // Tam genişlik
        margin="auto" // Ortala
        border={2}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            GALERİ
          </Typography>
          <Ekle AddGaleri={AddGaleri} GaleriList={GaleriList} />
        </Box>
        <Box sx={{ height: '5vh' }} />
        <ImageList sx={{ width: '100%', height: 1000 }} cols={3} rowHeight={400}>
          <ImageListItem key="Subheader" style={{ textAlign: 'center' }}>
            {/* GEREKLİ BİR ŞEY EKLE */}
          </ImageListItem>
          {GaleriList.map((item) => (
            <ImageListItem key={item.img}>
              <Image
                // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=248&fit=crop&auto=format`}
                alt={item.title}
                width={1000}
                height={1200}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.title}
                subtitle={`id: #${item.id}`}
                actionIcon={
                  <IconButton onClick={() => handleDelete(item.id)} sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box sx={{ height: '10vh' }} />
    </>
  );
};

export default GaleriForm;
