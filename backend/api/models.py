from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True, db_column='id_usuario')
    nombre = models.CharField(max_length=100)
    primer_apellido = models.CharField(max_length=100, blank=True, null=True)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    correo_electronico = models.CharField(max_length=300, unique=True)
    contraseña = models.CharField(max_length=200)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    tipo_usuario = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'usuario'

class Institucion(models.Model):
    id_institucion = models.AutoField(primary_key=True, db_column='id_institucion')
    nombre = models.CharField(max_length=100)
    logo = models.CharField(max_length=500, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    set_colores = models.CharField(max_length=100, blank=True, null=True)
    correo_electronico = models.CharField(max_length=300, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')

    class Meta:
        managed = False
        db_table = 'institucion'

class SolicitudInstitucion(models.Model):
    id_solicitud = models.AutoField(primary_key=True, db_column='id_solicitud')
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    nombre = models.CharField(max_length=100)
    logo = models.CharField(max_length=500, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'solicitud_institucion'

class Estacion(models.Model):
    id_estacion = models.AutoField(primary_key=True, db_column='id_estacion')
    nombre = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    estado = models.CharField(max_length=20)
    certificado = models.CharField(max_length=500, blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_institucion = models.ForeignKey(Institucion, models.DO_NOTHING, db_column='id_institucion')

    class Meta:
        managed = False
        db_table = 'estacion'

class SolicitudEstacion(models.Model):
    id_solicitud = models.AutoField(primary_key=True, db_column='id_solicitud')
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_institucion = models.ForeignKey(Institucion, models.DO_NOTHING, db_column='id_institucion')
    nombre = models.CharField(max_length=100)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    certificado = models.CharField(max_length=500, blank=True, null=True)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'solicitud_estacion'

class Variable(models.Model):
    id_variable = models.AutoField(primary_key=True, db_column='id_variable')
    tipo = models.CharField(max_length=100)
    nombre = models.CharField(max_length=100)
    unidad = models.CharField(max_length=20)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'variable'

class Sensor(models.Model):
    id_sensor = models.AutoField(primary_key=True, db_column='id_sensor')
    fecha_instalacion = models.DateField(blank=True, null=True)
    estado = models.CharField(max_length=20)
    fabricante = models.CharField(max_length=100, blank=True, null=True)
    tipo = models.CharField(max_length=100, blank=True, null=True)
    modelo = models.CharField(max_length=50, blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_estacion = models.ForeignKey(Estacion, models.DO_NOTHING, db_column='id_estacion')
    id_variable = models.ForeignKey(Variable, models.DO_NOTHING, db_column='id_variable')

    class Meta:
        managed = False
        db_table = 'sensor'

class Medicion(models.Model):
    id_medicion = models.AutoField(primary_key=True, db_column='id_medicion')
    id_sensor = models.ForeignKey(Sensor, models.DO_NOTHING, db_column='id_sensor')
    id_variable = models.ForeignKey(Variable, models.DO_NOTHING, db_column='id_variable')
    valor = models.DecimalField(max_digits=10, decimal_places=3)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'medicion'

class Alerta(models.Model):
    id_alerta = models.AutoField(primary_key=True, db_column='id_alerta')
    id_estacion = models.ForeignKey(Estacion, models.DO_NOTHING, db_column='id_estacion')
    id_variable = models.ForeignKey(Variable, models.DO_NOTHING, db_column='id_variable')
    nivel = models.CharField(max_length=20)
    valor = models.DecimalField(max_digits=10, decimal_places=3)
    fecha = models.DateTimeField(auto_now_add=True)
    mensaje = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'alerta'

class Reporte(models.Model):
    id_reporte = models.AutoField(primary_key=True, db_column='id_reporte')
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    tipo_reporte = models.CharField(max_length=50)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    class Meta:
        managed = False
        db_table = 'reporte'
