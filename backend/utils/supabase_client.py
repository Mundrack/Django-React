"""
Cliente de Supabase para interactuar con la base de datos
"""

from supabase import create_client, Client
from django.conf import settings


class SupabaseClient:
    """
    Singleton para manejar la conexión con Supabase
    """
    _instance = None
    _client: Client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Inicializa el cliente de Supabase"""
        try:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
        except Exception as e:
            raise Exception(f"Error al inicializar Supabase: {str(e)}")

    @property
    def client(self) -> Client:
        """Retorna el cliente de Supabase"""
        if self._client is None:
            self._initialize()
        return self._client


# Instancia global del cliente
supabase_client = SupabaseClient().client


# Funciones de utilidad
def get_supabase() -> Client:
    """
    Retorna una instancia del cliente Supabase
    
    Returns:
        Client: Cliente de Supabase
    """
    return supabase_client


# Funciones helper para operaciones comunes
class SupabaseHelper:
    """
    Clase helper con métodos útiles para interactuar con Supabase
    """
    
    @staticmethod
    def select_all(table: str, filters: dict = None):
        """
        Selecciona todos los registros de una tabla
        
        Args:
            table (str): Nombre de la tabla
            filters (dict): Filtros opcionales
            
        Returns:
            list: Lista de registros
        """
        query = supabase_client.table(table).select("*")
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        response = query.execute()
        return response.data
    
    @staticmethod
    def select_by_id(table: str, record_id: str):
        """
        Selecciona un registro por ID
        
        Args:
            table (str): Nombre de la tabla
            record_id (str): ID del registro
            
        Returns:
            dict: Registro encontrado o None
        """
        response = supabase_client.table(table).select("*").eq("id", record_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def insert(table: str, data: dict):
        """
        Inserta un nuevo registro
        
        Args:
            table (str): Nombre de la tabla
            data (dict): Datos a insertar
            
        Returns:
            dict: Registro insertado
        """
        response = supabase_client.table(table).insert(data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update(table: str, record_id: str, data: dict):
        """
        Actualiza un registro
        
        Args:
            table (str): Nombre de la tabla
            record_id (str): ID del registro
            data (dict): Datos a actualizar
            
        Returns:
            dict: Registro actualizado
        """
        response = supabase_client.table(table).update(data).eq("id", record_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete(table: str, record_id: str):
        """
        Elimina un registro
        
        Args:
            table (str): Nombre de la tabla
            record_id (str): ID del registro
            
        Returns:
            dict: Registro eliminado
        """
        response = supabase_client.table(table).delete().eq("id", record_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def query(table: str):
        """
        Retorna un query builder para operaciones más complejas
        
        Args:
            table (str): Nombre de la tabla
            
        Returns:
            QueryBuilder: Constructor de consultas
        """
        return supabase_client.table(table)


# Exportar para uso fácil
__all__ = ['get_supabase', 'supabase_client', 'SupabaseHelper']