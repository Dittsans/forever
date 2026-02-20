async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getSiswaForHome(limit) {
  const data = await fetchAPI(
  `
    query AllSiswa($limit: Int){
      siswas(sort: "absen:asc", limit: $limit) {
        absen
        nama
        panggilan
      }
    }
  `,
  {
    variables: {
      limit
    }
  }
  )
  return data
}

export async function getSiswa(noabsen) {
  const data = await fetchAPI(
    `
      query Siswa($where: JSON){
        siswas(where: $where) {
          absen
          nama
          panggilan
          ttl
          alamat
          nohp
          ig
          fb
          telegram
          line
          tiktok
          linkedin
          pesan
        }
      }
    `,
    {
      variables: {
        where: {
          ...({ absen: noabsen }),
        },
      },
    }
  )

  return data
}

export async function getAllGaleri() {
  const data = await fetchAPI(
    `
      query AllGaleri{
        galeris{
          id
          caption
          gambar{
            url
          }
        }
      }
    `
  )

  return data
}

export async function getGaleri(id) {
  const data = await fetchAPI(
    `
      query Galeri($where: JSON){
        galeris(where: $where){
          id
          caption
          gambar{
            url
          }
        }
      }
    `,
    {
      variables: {
        where: {
          ...({ id: id }),
        }
      }
    }
  )

  return data
}