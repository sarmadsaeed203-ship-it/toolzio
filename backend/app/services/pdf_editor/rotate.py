from pypdf import PageObject

def apply_rotation(page: PageObject, rotation: int) -> PageObject:
    """
    Applies rotation to a PDF page.
    The rotation angle must be a multiple of 90.
    """
    if rotation % 90 != 0:
        raise ValueError("Rotation must be a multiple of 90 degrees.")
        
    if rotation != 0:
        page.rotate(rotation)
    
    return page
