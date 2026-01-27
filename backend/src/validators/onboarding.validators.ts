import { z } from 'zod';

// Brand onboarding validation schema
export const brandOnboardingSchema = z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    industry: z.string().optional(),
    company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], {
        errorMap: () => ({ message: 'Invalid company size range' }),
    }).optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    description: z.string().optional(),
    logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
});

// Capability schema for manufacturers
const capabilitySchema = z.object({
    category: z.string().min(1, 'Category is required'),
    subcategories: z.array(z.string()).min(1, 'At least one subcategory is required'),
});

// Certification schema for manufacturers
const certificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required'),
    issued_by: z.string().optional(),
    expires_at: z.string().optional().nullable(),
});

// Manufacturer onboarding validation schema
export const manufacturerOnboardingSchema = z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    capabilities: z.array(capabilitySchema).min(1, 'At least one capability is required'),
    production_capacity: z.string().optional(),
    factory_location: z.string().optional(),
    certifications: z.array(certificationSchema).optional(),
    year_established: z.number().min(1800).max(new Date().getFullYear()).optional(),
    employee_count: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    description: z.string().optional(),
    logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
});

export type BrandOnboardingInput = z.infer<typeof brandOnboardingSchema>;
export type ManufacturerOnboardingInput = z.infer<typeof manufacturerOnboardingSchema>;
