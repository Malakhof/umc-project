import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
  role: z.enum(['ot_specialist', 'hr_director', 'ceo', 'other'], {
    required_error: 'Обязательное поле',
  }),
  company: z.string().min(1, 'Обязательное поле'),
  phone: z.string().min(1, 'Обязательное поле'),
  email: z.string().email('Неверный формат email'),
  program: z.string().optional(),
  count: z.number().optional(),
  message: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

export const roleLabels: Record<FormData['role'], string> = {
  ot_specialist: 'Специалист по охране труда',
  hr_director: 'HR-директор / Начальник отдела кадров',
  ceo: 'Генеральный директор',
  other: 'Другое',
}

export const programLabels: Record<string, string> = {
  leaders: 'Обучение руководителей по ОТ',
  specialist: 'Специалист по охране труда',
  authorized: 'Уполномоченный по охране труда',
  fire_safety: 'Пожарная безопасность',
  corporate: 'Корпоративное обучение',
  consultation: 'Методическая консультация',
}
