from rest_framework import serializers
from .models import (
    Usuario, Institucion, SolicitudInstitucion, Estacion, 
    SolicitudEstacion, Variable, Sensor, Medicion, Alerta, Reporte
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {'contraseña': {'write_only': True}}

    def create(self, validated_data):
        # In a real scenario, hash the password here
        # validated_data['contraseña'] = make_password(validated_data['contraseña'])
        return super().create(validated_data)

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'

class SolicitudInstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudInstitucion
        fields = '__all__'

class EstacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacion
        fields = '__all__'

class SolicitudEstacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudEstacion
        fields = '__all__'

class VariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variable
        fields = '__all__'

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'

class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerta
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'
