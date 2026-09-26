-- KINZA — mise à jour de l'identité de marque
-- À exécuter dans Supabase > SQL Editor pour mettre à jour les textes déjà enregistrés.

update public.site_content
set value = replace(
  replace(
    replace(value, 'ASALA', 'KINZA'),
    'asala.tn',
    'kinza.tn'
  ),
  '+216 71 000 000',
  '+216 52 374 459'
)
where value ilike '%asala%'
   or value like '%+216 71 000 000%';

update public.site_content
set value = replace(value, '+216 98 123 456', '+216 52 374 459')
where value like '%+216 98 123 456%';

update public.home_sections
set eyebrow = replace(eyebrow, 'ASALA', 'KINZA'),
    title = replace(title, 'ASALA', 'KINZA'),
    subtitle = replace(subtitle, 'ASALA', 'KINZA'),
    description = replace(description, 'ASALA', 'KINZA'),
    button_label = replace(button_label, 'ASALA', 'KINZA');

update public.home_collection_tiles
set eyebrow = replace(eyebrow, 'ASALA', 'KINZA'),
    title = replace(title, 'ASALA', 'KINZA'),
    button_label = replace(button_label, 'ASALA', 'KINZA');

notify pgrst, 'reload schema';
