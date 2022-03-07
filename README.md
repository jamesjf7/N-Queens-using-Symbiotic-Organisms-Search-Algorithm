# Solving N Queens Problem using Symbiotic Organisms Search Algorithm
<b>[ Evolutionary Algorithm ]</b>

by James Jeremy Foong / 218116689

6689 -->  N-Queen dengan algoritma Symbiotic Organisms Search

untuk nilai upper bound dan lower bound adalah 1 dan 0

## FILE
- bootstrap : library untuk menghias tampilan halaman
- jquery.js : library javascript untuk mempermudah penggunaan javascript
- numjs.js : library numpy tapi untuk javascript
- script.js : berisi kodingan SOS dan function lainnya
- index.html : halaman utama

![alt text](/image/web.png)

## Generate population
- Population size : jumlah individu(vektor)
- Board size : ukuran papan sekaligus menjadi jumlah attribute dalam 1 individu(vektor)
- Button generate population : untuk mengenerate populasi random dengan inputan yang sudah ditentukan dan akan ditampilkan pada textarea population(JSON format) dibawah

## Calculate
- max iteration : max iterasi
- population(JSON format) : menjadi populasi dimana populasi tersebut dalam bentuk JSON
- Button solve : untuk menjalankan fungsi SOS dan akan menampilkan papan catur tergantung inputan population(JSON format)

Contoh JSON ukuran papan 4 dan jumlah individu 5 : 
```json
{
    [
        [0.7970695380779906,0.5029598929202357,0.5139394772066539,0.39559929356173096],
        [0.26828892644437996,0.9555349151898209,0.6709084640961789,0.8933318536365775],
        [0.12992280573670367,0.4399773056715699,0.8467243356317431,0.24285991038222532],
        [0.041365614379860416,0.6148491696733769,0.12444574021316335,0.31716082410343005],
        [0.1744149188972206,0.3178909034294717,0.6748512764534935,0.5280743215951129]
    ]
}
```
