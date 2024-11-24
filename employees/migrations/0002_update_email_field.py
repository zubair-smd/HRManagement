# employees/migrations/0002_update_email_field.py
from django.db import migrations, models  # Add models here

def update_null_emails(apps, schema_editor):
    Employee = apps.get_model('employees', 'Employee')
    db_alias = schema_editor.connection.alias
    Employee.objects.using(db_alias).filter(email__isnull=True).update(
        email='noreply@company.com'
    )

class Migration(migrations.Migration):
    dependencies = [
        ('employees', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(update_null_emails),
        migrations.AlterField(
            model_name='employee',
            name='email',
            field=models.EmailField(max_length=254, default='noreply@company.com'),  # Use models.EmailField
        ),
    ]