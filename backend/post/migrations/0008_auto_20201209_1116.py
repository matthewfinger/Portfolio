# Generated by Django 3.1.4 on 2020-12-09 17:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0007_auto_20201209_1104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]