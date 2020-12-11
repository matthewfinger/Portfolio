# Generated by Django 3.1.4 on 2020-12-09 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_auto_20201207_2201'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='content_id',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='subtitle',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='subtitle_class',
            field=models.CharField(default='post_subtitle', max_length=100),
        ),
        migrations.AddField(
            model_name='post',
            name='subtitle_id',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='title_id',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
