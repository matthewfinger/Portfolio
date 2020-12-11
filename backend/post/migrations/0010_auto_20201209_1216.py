# Generated by Django 3.1.4 on 2020-12-09 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0009_auto_20201209_1128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.TextField(blank=True, default='', max_length=5000),
        ),
        migrations.AlterField(
            model_name='post',
            name='name',
            field=models.CharField(default='eeb2e3d3-a35c-4a1a-8c4b-9da08d03849d', max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
