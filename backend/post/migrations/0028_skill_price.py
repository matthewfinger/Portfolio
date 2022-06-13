# Generated by Django 3.1.4 on 2022-06-13 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0027_skill_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='skill',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=10, null=True),
        ),
    ]
