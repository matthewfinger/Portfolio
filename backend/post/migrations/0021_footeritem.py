# Generated by Django 3.1.4 on 2021-01-14 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0020_sample'),
    ]

    operations = [
        migrations.CreateModel(
            name='FooterItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('href', models.URLField()),
                ('order_key', models.IntegerField(blank=True, default=0)),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='post.image')),
            ],
        ),
    ]
