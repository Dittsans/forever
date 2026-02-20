import Head from 'next/head';
import React, { Component } from 'react';
import { getSiswaForHome, getSiswa, getAllGaleri, getGaleri } from '../lib/siswa';
import { withRouter } from 'next/router';

{/** sudah aman terkendali bang */}
export async function getServerSideProps(context) {
  const { absen, page = "1", galeri } = context.query;
  const currentPage = Number(page) || 1;
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!API_URL) {
    console.error("STRAPI API URL not defined");
    return {
      props: {
        siswa: [],
        galeri: [],
        page: 1,
        lastPage: 1,
      },
    };
  }
  let totalCount = 0;
  try {
    const countRes = await fetch(`${API_URL}/siswas/count`);
    if (!countRes.ok) {
      throw new Error(`Failed fetch count: ${countRes.status}`);
    }
    const text = await countRes.text();
    try {
      totalCount = JSON.parse(text);
    } catch (err) {
      console.error("Response is not valid JSON:", text);
      totalCount = 0;
    }
  } catch (err) {
    console.error("Error fetching count:", err);
    totalCount = 0;
  }
  const lastPage = Math.ceil(totalCount / 6) || 1;
  const limit = currentPage === 1 ? 6 : currentPage * 6;
  let siswaData = [];
  let galeriData = [];
  try {
    siswaData = await getSiswaForHome(limit);
  } catch (err) {
    console.error("Error getSiswaForHome:", err);
  }
  try {
    galeriData = await getAllGaleri();
  } catch (err) {
    console.error("Error getAllGaleri:", err);
  }
  if (galeri) {
    try {
      const modalGaleri = await getGaleri(galeri);
      return {
        props: {
          siswa: siswaData,
          modalGaleri,
          galeri: galeriData,
          page: currentPage,
          lastPage,
        },
      };
    } catch (err) {
      console.error("Error getGaleri:", err);
    }
  }
  if (absen) {
    try {
      const modalSiswa = await getSiswa(absen);
      return {
        props: {
          siswa: siswaData,
          modalSiswa,
          galeri: galeriData,
          page: currentPage,
          lastPage,
        },
      };
    } catch (err) {
      console.error("Error getSiswa:", err);
    }
  }

  return {
    props: {
      siswa: siswaData,
      galeri: galeriData,
      page: currentPage,
      lastPage,
    },
  };
}

class Home extends Component {

  componentDidMount () {
    let htmlClasses = document.querySelector('body').classList;
    let sun = document.querySelector('#sun').classList;
    let moon = document.querySelector('#moon').classList;

    document.getElementById('switchTheme').addEventListener('click', function() {
      if(localStorage.getItem('theme') === 'dark') {
        htmlClasses.remove('dark');
        localStorage.removeItem('theme');
        sun.add('hidden');
        moon.remove('hidden');
        document.querySelector('.toggleCircle').removeAttribute('style','transform: translateX(100%)');
        document.querySelector('.togglePath').removeAttribute('style','background-color: #374151');
      } else {
        htmlClasses.add('dark');
        localStorage.setItem('theme', 'dark');
        sun.remove('hidden');
        moon.add('hidden');
        document.querySelector('.toggleCircle').setAttribute('style','transform: translateX(100%)');
        document.querySelector('.togglePath').setAttribute('style','background-color: #374151');
      }
    });

    if(localStorage.getItem('theme') === 'dark'){
      htmlClasses.add('dark');
      sun.remove('hidden');
      moon.add('hidden');
      document.querySelector('.toggleCircle').setAttribute('style','transform: translateX(100%)');
      document.querySelector('.togglePath').setAttribute('style','background-color: #374151');
    };

  }

  constructor(props) {
    super(props);
    this.state = {
      showModalSiswa: false,
      showModalGaleri: false
    };
  }

  onClickSiswa = (absen) => {
    this.props.router.push(`?page=${this.props.page}&absen=${absen}`,'/');
    this.setState({showModalSiswa: absen});
  }

  onClickNext = () => {
    this.props.router.push(`/?page=${this.props.page + 1}`,'/');
  }

  onClickClearSiswa = () => {
    this.props.router.push(`/?page=${this.props.page}`,'/');
    this.setState({showModalSiswa: false});
  }

  onClickGaleri = (galeri) => {
    this.props.router.push(`/?page=${this.props.page}&galeri=${galeri}`,'/');
    this.setState({showModalGaleri: galeri});
  }

  onClickClearGaleri = () => {
    this.props.router.push(`/?page=${this.props.page}`,'/');
    this.setState({showModalGaleri: false});
  }

  render() {
    return (
      <>
        <Head>
          <title>Mi atau ManKomDig? </title>
        </Head>
        {this.state.showModalSiswa || this.state.showModalGaleri ?
          <style jsx>{`
            body{
              overflow: hidden;
              -webkit-font-smoothing: antialiased;
            }
          `}</style>
        :
          <style jsx>{`
            body{
              -webkit-font-smoothing: antialiased;
            }
          `}
          </style>
        }
        <header className="relative z-10 mt-5">
          <nav>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                </div>
                <div className="flex items-center ml-4 md:ml-6">
                  <div className="relative mr-3">
                    <div className="flex justify-center">
                      <div id="switchTheme" className="flex items-center cursor-pointer">
                        <div className="relative">
                          <div className="w-12 h-5 bg-white rounded-full shadow-inner togglePath" id=""></div>
                          <div className="absolute inset-y-0 left-0 w-5 h-5 text-gray-900 rounded-full shadow toggleCircle bg-tranparent dark:text-white">
                            <svg id="moon" className="w-5 h-5 shadow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                            <svg id="sun" className="hidden w-5 h-5 shadow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="pt-24 text-center jumbotron pb-72">
          <div className="mx-3 jumbotron-text mt-28">
            <p className="mt-2 text-6xl font-extrabold tracking-tight text-white lg:text-9xl md:text-7xl dark:text-gray-200">
            Galery <span className="text-indigo-600">ManKomDig</span>.
            </p>
            <p className="max-w-2xl mx-auto mt-4 text-base font-semibold text-gray-300 break-words md:text-lg lg:text-xl">
              Belum tau jirt mau di isi apa.
            </p>
          </div>
        </div>
        <div className="mx-auto -mt-16 text-indigo-600 dark:text-indigo-400">
          <svg className="w-8 h-8 mx-auto md:h-9 md:w-9 lg:h-10 lg:w-10 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="about mt-60">
          <div className="flex flex-col px-4 py-12 text-center sm:px-6 lg:py-20 lg:px-24 md:text-left md:flex-row md:items-center md:justify-between md:p-12 bg-indigo-50 dark:bg-gray-900">
            <div className="text-2xl font-semibold md:text-4xl md:w-3/4">
              <div className="text-base font-medium text-gray-800 dark:text-gray-200">Kelas yang penuh kenangan adalah kelas penuh keramaian, kekocakan, kekompakan. Web ini bukan tentang sekolah tapi tentang kelas, semua hal dilakukan akan terkenang didalam memori otak tapi kadang suka lupa karena itu web ini ada. Mungkin web ini bisa nonaktif tetapi akan bisa diaktifkan kembali tanpa ada data hilang.</div>
              <div className="mt-3 text-indigo-500">Tentang Kami.</div>
            </div>

            <a className="mt-4 md:mt-0 md:ml-2" href="https://www.instagram.com/information_management25" target="_blank">
              <div className="inline-block px-5 py-3 font-semibold text-indigo-400 bg-white rounded-md shadow-lg hover:bg-indigo-400 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-400 dark:hover:text-white">
                <i className="mr-1 fab fa-instagram"></i> Instagram
              </div>
            </a>
          </div>
        </div>
        <main className="px-3 mt-64 md:mt-70 lg:px-12">
          <div className="gallery mt-44">
            <div className="text-center">
              <p className="mt-2 text-4xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-gray-200 md:text-5xl">
                Galeri
              </p>
              <p className="max-w-2xl mx-auto mt-4 text-base text-gray-500 dark:text-gray-400">
                Foto-Foto Masa Kuliah dan kebersamaan diluar.
              </p>
            </div>
            {this.props.galeri.length != 0 ? 
              <>
                {this.props.galeri.galeris?.map(galeri => {
                  return (
                    <div id="photos" className="grid grid-cols-1 gap-3 my-5 mt-10 md:grid-cols-2 lg:grid-cols-3" key={galeri.id}>
                      <div className="mt-1 transition duration-500 ease-in-out transform md:mt-3 hover:-translate-y-1 hover:scale-110">
                          <a onClick={() => this.onClickGaleri(galeri.id)}>
                            <img className="object-contain w-full h-64" src={galeri.gambar.url} alt={galeri.caption} loading="lazy" />
                          </a>
                      </div>
                    </div>
                  )
                })}
              </>
              :
              <span className="mx-auto mt-20 text-base font-semibold text-center md:text-lg">Tidak Ada Data</span>
            }
            {this.state.showModalGaleri && this.props.modalGaleri ? (
              <>
                {this.props.modalGaleri.galeris?.map(galeri => {
                  return (
                    <>
                      <div className="fixed inset-0 z-50 items-center content-center justify-center mx-5 my-auto overflow-y-auto outline-none focus:outline-none">
                        <div className="relative w-full max-w-3xl mx-auto my-6">
                          <div className="relative flex flex-col items-start justify-between w-full p-5 -mb-2 border-0 outline-none">
                            <button id="cm"
                              className="float-right p-1 ml-auto text-4xl leading-none text-gray-300 bg-transparent border-0 outline-none md:text-5xl focus:outline-none" onClick={this.onClickClearGaleri}>
                              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <img className="object-contain w-full h-full" src={galeri.gambar.url} loading="lazy" />
                          <div className="relative flex items-center justify-center w-full mx-auto my-6 font-semibold text-white">
                            <span>{galeri.caption}</span>
                          </div>
                        </div>
                      </div>
                      <div className="fixed inset-0 z-40 bg-black opacity-80"></div>
                    </>
                  )
                })}
              </>
            ) : null}
          </div>
        </main>
        <footer className="bottom-0 py-3 mt-20 shadow-inner">
          <div className="px-2 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <p className="mx-auto text-sm font-normal text-center truncate dark:text-gray-300">
              Made with &copy; by dittsans & Haidar
            </p>
          </div>
        </footer>
      </>
    )
  }
}

export default withRouter(Home)
