# Generated by Django 3.1.4 on 2020-12-09 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0010_auto_20201209_1216'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='name',
            field=models.CharField(default='453ecb51-9ab8-482c-9b23-5f3e520eacdb', max_length=100, unique=True),
        ),
    ]