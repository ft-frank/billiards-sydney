import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


const getData = async function() {

    const { data, error } = await supabase
    .from('venues')
    .select('name, latitude, longitude, address')

    return data
}

export const uploadVenueImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error } = await supabase.storage
        .from('General Image')
        .upload(fileName, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
        .from('General Image')
        .getPublicUrl(fileName)

    return urlData.publicUrl
}

export const insertVenue = async (venue: {
    name: string
    address: string
    latitude: number
    longitude: number
    table_count: number
    hourly_rate: number
    phone: string
    website_link: string
    image_url: string
    heyball: boolean
    '9ftpool': boolean
    '7ftpool': boolean
    snooker: boolean
    cushion: boolean
}) => {
    const { data, error } = await supabase
        .from('venues')
        .insert([venue])

    if (error) throw error
    return data
}

export default getData