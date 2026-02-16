'use client'
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { insertVenue, uploadVenueImage } from '../../lib/supabase/client'

const venueSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    latitude: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
    longitude: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
    table_count: z.coerce.number().int().min(1, 'Must have at least 1 table'),
    hourly_rate: z.coerce.number().min(0, 'Rate cannot be negative'),
    phone: z.string().optional().default(''),
    website_link: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
    heyball: z.boolean(),
    '9ftpool': z.boolean(),
    '7ftpool': z.boolean(),
    snooker: z.boolean(),
    cushion: z.boolean(),
})

type VenueFormData = z.infer<typeof venueSchema>

const VenueForm = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<VenueFormData>({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            heyball: false,
            '9ftpool': false,
            '7ftpool': false,
            snooker: false,
            cushion: false,
        },
    })

    const onSubmit = async (data: VenueFormData) => {
        try {
            let image_url = ''
            if (imageFile) {
                image_url = await uploadVenueImage(imageFile)
            }
            await insertVenue({ ...data, image_url })
            setSubmitStatus('success')
            setImageFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            reset()
        } catch {
            setSubmitStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-sm"
            >
                <h1 className="mb-8 text-2xl font-bold text-gray-900">Add a Venue</h1>

                {/* Name */}
                <div className="mb-5">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Venue Name</label>
                    <input
                        {...register('name')}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. City Heroes Townhall"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                {/* Address */}
                <div className="mb-5">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                    <input
                        {...register('address')}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. Shop 6/505 George St Sydney NSW 2000"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                </div>

                {/* Latitude & Longitude */}
                <div className="mb-5 grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                            {...register('latitude')}
                            type="number"
                            step="any"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            placeholder="-33.875163"
                        />
                        {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                            {...register('longitude')}
                            type="number"
                            step="any"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            placeholder="151.206341"
                        />
                        {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude.message}</p>}
                    </div>
                </div>

                {/* Table Count & Hourly Rate */}
                <div className="mb-5 grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Table Count</label>
                        <input
                            {...register('table_count')}
                            type="number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            placeholder="20"
                        />
                        {errors.table_count && <p className="mt-1 text-sm text-red-500">{errors.table_count.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                        <input
                            {...register('hourly_rate')}
                            type="number"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            placeholder="25.00"
                        />
                        {errors.hourly_rate && <p className="mt-1 text-sm text-red-500">{errors.hourly_rate.message}</p>}
                    </div>
                </div>

                {/* Phone */}
                <div className="mb-5">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        {...register('phone')}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Optional"
                    />
                </div>

                {/* Website Link */}
                <div className="mb-5">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Website Link</label>
                    <input
                        {...register('website_link')}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://example.com"
                    />
                    {errors.website_link && <p className="mt-1 text-sm text-red-500">{errors.website_link.message}</p>}
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Venue Image</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imageFile && (
                        <p className="mt-1 text-sm text-gray-500">{imageFile.name}</p>
                    )}
                </div>

                {/* Game Types */}
                <div className="mb-8">
                    <label className="mb-3 block text-sm font-medium text-gray-700">Game Types Available</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { key: 'heyball' as const, label: 'Heyball' },
                            { key: '9ftpool' as const, label: '9ft Pool' },
                            { key: '7ftpool' as const, label: '7ft Pool' },
                            { key: 'snooker' as const, label: 'Snooker' },
                            { key: 'cushion' as const, label: 'Cushion' },
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    {...register(key)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Venue'}
                </button>

                {submitStatus === 'success' && (
                    <p className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                        Venue added successfully!
                    </p>
                )}
                {submitStatus === 'error' && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                        Something went wrong. Please try again.
                    </p>
                )}
            </form>
        </div>
    )
}

export default VenueForm
